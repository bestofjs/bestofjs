import { schema } from "@repo/db";
import { eq, not } from "@repo/db/drizzle";
import { flattenSnapshots } from "@repo/db/projects";
import {
  computeActivityScore,
  computePopularityScore,
} from "@repo/db/repo-trends";
import { computeTrends } from "@repo/db/snapshots";

import { createTask } from "@/task-runner";

export const updateRepoTrendsTask = createTask({
  name: "update-repo-trends",
  description:
    "Compute repo-level trend deltas and popularity/activity scores; upsert into repo_trends. Runs daily.",
  run: async ({ db, processRepos, logger }) => {
    return await processRepos(
      async (repo) => {
        const trends = computeTrends(flattenSnapshots(repo.snapshots));
        const popularityScore = computePopularityScore(trends);
        const activityScore = computeActivityScore({
          lastCommit: repo.last_commit,
          contributors: repo.contributor_count,
        });

        const recordData = {
          repoId: repo.id,
          stars: repo.stars,
          daily: trends.daily ?? null,
          weekly: trends.weekly ?? null,
          monthly: trends.monthly ?? null,
          quarterly: trends.quarterly ?? null,
          yearly: trends.yearly ?? null,
          popularityScore,
          activityScore,
        };

        await db
          .insert(schema.repoTrends)
          .values(recordData)
          .onConflictDoUpdate({
            target: schema.repoTrends.repoId,
            set: { ...recordData, updatedAt: new Date() },
          });

        logger.debug("repo_trends upserted", {
          repo: repo.full_name,
          popularityScore,
          activityScore,
          stars: repo.stars,
        });

        return {
          data: null,
          meta: { updated: true },
        };
      },
      { where: not(eq(schema.projects.status, "deprecated")) },
    );
  },
});
