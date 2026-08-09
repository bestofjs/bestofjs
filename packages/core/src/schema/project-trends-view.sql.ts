import { eq, sql } from "drizzle-orm";
import { pgView } from "drizzle-orm/pg-core";

import { projectTrends } from "./project-trends.sql";
import { projects } from "./projects.sql";
import { repos } from "./repos.sql";

export const projectTrendsView = pgView("project_trends_view").as((qb) =>
  qb
    .select({
      projectId: projectTrends.projectId,
      slug: projects.slug,
      name: projects.name,
      status: projects.status,
      fullName: sql<string>`${repos.owner} || '/' || ${repos.name}`.as(
        "full_name",
      ),
      packageName: projectTrends.packageName,
      monthlyDownloads: projectTrends.monthlyDownloads,
      usageScore: projectTrends.usageScore,
      relevanceScore: projectTrends.relevanceScore,
      updatedAt: projectTrends.updatedAt,
    })
    .from(projectTrends)
    .innerJoin(projects, eq(projectTrends.projectId, projects.id))
    .innerJoin(repos, eq(projects.repoId, repos.id)),
);
