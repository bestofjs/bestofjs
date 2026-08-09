import { eq, sql } from "drizzle-orm";
import { pgView } from "drizzle-orm/pg-core";

import { repoTrends } from "./repo-trends";
import { repos } from "./repos";

export const repoTrendsView = pgView("repo_trends_view").as((qb) =>
  qb
    .select({
      repoId: repoTrends.repoId,
      fullName: sql<string>`${repos.owner} || '/' || ${repos.name}`.as(
        "full_name",
      ),
      stars: repoTrends.stars,
      daily: repoTrends.daily,
      weekly: repoTrends.weekly,
      monthly: repoTrends.monthly,
      quarterly: repoTrends.quarterly,
      yearly: repoTrends.yearly,
      popularityScore: repoTrends.popularityScore,
      activityScore: repoTrends.activityScore,
      updatedAt: repoTrends.updatedAt,
    })
    .from(repoTrends)
    .innerJoin(repos, eq(repoTrends.repoId, repos.id)),
);
