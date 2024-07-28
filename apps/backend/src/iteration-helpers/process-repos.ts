import { desc, eq } from "drizzle-orm";
import invariant from "tiny-invariant";
import pMap from "p-map";

import { DB, schema } from "@repo/db";

import { LoopOptions, TaskContext } from "@/task-runner";
import { CallbackResult, aggregateResults } from "./utils";

// type Repo = typeof schema.repos.$inferSelect;
export type Repo = Awaited<ReturnType<typeof findRepoById>>;

export function processRepos(context: TaskContext) {
  const { db, logger } = context;

  return async function <T>(
    callback: (repo: Repo, index: number) => Promise<CallbackResult<T>>,
    options?: LoopOptions
  ) {
    const {
      limit = 0,
      skip = 0,
      name,
      throwOnError = false,
      concurrency = 1,
    } = options || {};

    const ids = await findAllIds();
    const results = await pMap(
      ids,
      async (id, index) => {
        const repo = await findRepoById(db, id);
        try {
          logger.debug(`Processing repo #${index + 1}`, repo.full_name);
          const data = await callback(repo, index);
          logger.info(`Processed repo ${repo.full_name}`, data);
          return data;
        } catch (error) {
          logger.error(`Error processing repo ${repo.name}`, error);
          if (throwOnError)
            throw new Error(`Error processing repo ${repo.name}`, {
              cause: error,
            });
          return { meta: { error: true }, data: null };
        }
      },
      {
        concurrency,
      }
    );

    logger.info("Processed", ids.length, "repos");

    return aggregateResults(results);

    async function findAllIds() {
      const query = db
        .select({ id: schema.repos.id })
        .from(schema.repos)
        .orderBy(desc(schema.repos.added_at))
        .limit(limit)
        .offset(skip);

      if (name) {
        query.where(eq(schema.repos.full_name, name));
      }

      const repos = await query;
      if (!repos.length) logger.error("No repos found");

      const ids = repos.map((repo) => repo.id);
      return ids;
    }
  };
}

async function findRepoById(db: DB, id: string) {
  const repo = await db.query.repos.findFirst({
    where: eq(schema.repos.id, id),
    with: { projects: true },
  });
  invariant(repo, `Repo not found by id: ${id}`);
  return repo;
}
