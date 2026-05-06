import { schema } from "@repo/db";
import {
  computeRelevanceScore,
  computeUsageScore,
} from "@repo/db/project-trends";
import type { ProjectDetails } from "@repo/db/projects";

import { createTask } from "@/task-runner";

export const updateProjectTrendsTask = createTask({
  name: "update-project-trends",
  description:
    "Compute project-level usage and relevance scores from packages + repo_trends; upsert into project_trends. Runs daily after update-repo-trends.",
  run: async ({ db, processProjects, logger, dryRun }) => {
    const repoTrendsRows = await db
      .select({
        repoId: schema.repoTrends.repoId,
        popularityScore: schema.repoTrends.popularityScore,
        activityScore: schema.repoTrends.activityScore,
      })
      .from(schema.repoTrends);

    const repoTrendsByRepoId = new Map(
      repoTrendsRows.map((r) => [
        r.repoId,
        { popularityScore: r.popularityScore, activityScore: r.activityScore },
      ]),
    );
    logger.info(`Loaded ${repoTrendsByRepoId.size} repo_trends rows`);

    return await processProjects(async (project) => {
      const primaryPackage = pickPrimaryPackage(project.packages);
      const monthlyDownloads = primaryPackage?.monthlyDownloads ?? null;
      const usageScore = computeUsageScore(monthlyDownloads);

      const repoTrend = repoTrendsByRepoId.get(project.repoId);
      const popularityScore = repoTrend?.popularityScore ?? 0;
      const activityScore = repoTrend?.activityScore ?? 0;

      const relevanceScore = computeRelevanceScore({
        popularityScore,
        activityScore,
        usageScore: primaryPackage ? usageScore : undefined,
        isDeprecated: project.status === "deprecated",
      });

      const recordData = {
        projectId: project.id,
        packageName: primaryPackage?.name ?? null,
        monthlyDownloads,
        usageScore,
        relevanceScore,
      };

      if (!dryRun) {
        await db
          .insert(schema.projectTrends)
          .values(recordData)
          .onConflictDoUpdate({
            target: schema.projectTrends.projectId,
            set: { ...recordData, updatedAt: new Date() },
          });
      }

      logger.debug(
        dryRun
          ? "project_trends scores (dry run, no write)"
          : "project_trends upserted",
        {
          slug: project.slug,
          packageName: recordData.packageName,
          monthlyDownloads,
          usageScore,
          relevanceScore,
        },
      );

      return {
        data: null,
        meta: { updated: !dryRun, kept: relevanceScore >= 0 },
      };
    });
  },
});

function pickPrimaryPackage(packages: ProjectDetails["packages"]) {
  if (packages.length === 0) return null;
  return packages.reduce((best, current) => {
    const bestDownloads = best.monthlyDownloads ?? 0;
    const currentDownloads = current.monthlyDownloads ?? 0;
    return currentDownloads > bestDownloads ? current : best;
  });
}
