import { schema } from "@repo/db";
import { and, desc, eq, SQL } from "@repo/db/drizzle";
import { ProjectDetails, ProjectService } from "@repo/db/projects";
import { TaskLoopOptions, TaskRunnerContext } from "@/task-types";
import { ItemProcessor } from "./abstract-item-processor";

export class ProjectProcessor extends ItemProcessor<ProjectDetails> {
  type = "project";
  service: ProjectService;

  constructor(context: TaskRunnerContext, loopOptions: TaskLoopOptions) {
    super(context, loopOptions);
    this.service = new ProjectService(context.db);
  }

  toString(item: ProjectDetails) {
    return item.slug;
  }

  async getAllItemsIds(where?: SQL) {
    const { db, logger } = this.context;
    const { limit, skip, fullName, slug } = this.loopOptions;
    const { projects, repos } = schema;

    const query = db
      .select({ id: projects.id })
      .from(projects)
      .orderBy(desc(projects.createdAt))
      .offset(skip)
      .leftJoin(repos, eq(projects.repoId, repos.id));

    if (limit) {
      query.limit(limit);
    }

    const whereClauses = [];

    if (slug) {
      whereClauses.push(eq(projects.slug, slug));
    }

    if (fullName) {
      const [owner, name] = fullName.split("/");
      whereClauses.push(eq(repos.owner, owner), eq(repos.name, name));
    }

    if (where) {
      whereClauses.push(where);
    }

    if (whereClauses.length > 0) {
      query.where(and(...whereClauses));
    }

    const foundProjects = await query;
    if (!foundProjects.length) logger.error("No projects found");

    const ids = foundProjects.map((repo) => repo.id);
    return ids;
  }

  async getItemById(id: string) {
    return await this.service.getProjectById(id);
  }
}
