import { schema } from "@repo/db";
import { count, ne, notInArray } from "@repo/db/drizzle";

import { createTask } from "@/task-runner";

export const cleanupRepoTrendsTask = createTask({
  name: "cleanup-repo-trends",
  description:
    "Delete repo_trends rows for repos linked only to deprecated projects. Runs daily before update-repo-trends.",
  run: async ({ db, logger, dryRun }) => {
    const reposWithActiveProject = db
      .select({ repoId: schema.projects.repoId })
      .from(schema.projects)
      .where(ne(schema.projects.status, "deprecated"));

    const deprecatedOnlyFilter = notInArray(
      schema.repoTrends.repoId,
      reposWithActiveProject,
    );

    if (dryRun) {
      const [row] = await db
        .select({ wouldDelete: count() })
        .from(schema.repoTrends)
        .where(deprecatedOnlyFilter);

      const n = Number(row?.wouldDelete ?? 0);
      logger.info(
        `Dry run: would delete ${n} repo_trends row(s) for deprecated-only repos`,
      );
      return {
        data: null,
        meta: { deleted: 0, wouldDelete: n },
      };
    }

    const result = await db
      .delete(schema.repoTrends)
      .where(deprecatedOnlyFilter);

    const deleted = result.rowCount ?? 0;
    logger.info(
      `Deleted ${deleted} repo_trends row(s) for deprecated-only repos`,
    );

    return {
      data: null,
      meta: { deleted },
    };
  },
});
