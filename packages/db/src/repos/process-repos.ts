import { eq } from "drizzle-orm";
import invariant from "tiny-invariant";

import * as schema from "@/schema";

import { DB, runQuery } from "..";

type Options = {
  limit?: number;
  offset?: number;
};
// type Repo = typeof schema.repos.$inferSelect;
type Repo = Awaited<ReturnType<typeof findRepoById>>;

export async function processRepos<T>(
  options: Options,
  callback: (repo: Repo) => T
) {
  runQuery(async (db) => {
    const ids = await findAllIds();
    for (const id of ids) {
      const repo = await findRepoById(db, id);
      const data = await callback(repo);
    }

    console.log("Processed", ids.length, "repos");

    async function findAllIds() {
      const repos = await db
        .select({ id: schema.repos.id })
        .from(schema.repos)
        .limit(options.limit || 1e5)
        .offset(options.offset || 0);

      const ids = repos.map((repo) => repo.id);
      return ids;
    }
  });
}

async function findRepoById(db: DB, id: string) {
  const repo = await db.query.repos.findFirst({
    where: eq(schema.repos.id, id),
    with: { projects: true },
  });
  invariant(repo, `Repo not found by id: ${id}`);
  return repo;
}
