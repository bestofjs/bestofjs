import { desc, eq } from "drizzle-orm";
import pMap from "p-map";

import { schema } from "@repo/db";
import { ProjectService } from "@repo/db/projects";

import { LoopOptions, RunnerContext } from "@/task-runner";
import { CallbackResult, aggregateResults } from "./utils";

export type Project = Awaited<ReturnType<ProjectService["getProjectById"]>>;

export function processProjects(context: RunnerContext) {
  const { db, logger } = context;

  const service = new ProjectService(db);

  return async function main<T>(
    callback: (project: Project, index: number) => Promise<CallbackResult<T>>,
    options?: LoopOptions
  ) {
    const { limit = 0, skip = 0, name, throwOnError = false } = options || {};

    const ids = await findAllIds();
    const results = await pMap(
      ids,
      async (id, index) => {
        const project = await service.getProjectById(id);
        try {
          logger.debug(`Processing project #${index + 1}`, project.slug);
          const result = await callback(project, index);
          logger.info(`Processed repo ${project.slug}`, result.meta);
          return result;
        } catch (error) {
          logger.error(`Error processing repo ${project.slug}`, error);
          if (error instanceof Error && error.cause) logger.debug(error.cause);
          if (throwOnError)
            throw new Error(`Error processing repo ${project.slug}`, {
              cause: error,
            });
          return { meta: { error: true }, data: null };
        }
      },
      {
        concurrency: options?.concurrency || 1,
      }
    );

    logger.info("Processed", ids.length, "repos");

    return aggregateResults(results);

    async function findAllIds() {
      const query = db
        .select({ id: schema.projects.id })
        .from(schema.projects)
        .orderBy(desc(schema.projects.createdAt))
        .limit(limit)
        .offset(skip);

      if (name) {
        query.where(eq(schema.projects.slug, name));
      }

      const projects = await query;
      if (!projects.length) logger.error("No projects found");

      const ids = projects.map((repo) => repo.id);
      return ids;
    }
  };
}
