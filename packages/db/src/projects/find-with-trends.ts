import { and, count, eq, gte, type SQL, sql } from "drizzle-orm";

import type { DB } from "../index";
import * as schema from "../schema";
import type { TrendsSortKey } from "../shared-schemas";
import { getWhereClauseSearchByTag, getWhereClauseSearchByText } from "./find";

const { projects, projectTrends, projectsToTags, repos, repoTrends, tags } =
  schema;

/**
 * Deprecated projects have no `repo_trends` row (deleted by the daily cleanup
 * task), so fall back to the canonical GitHub star count from `repos`.
 */
const starsExpression = sql<number>`COALESCE(${repoTrends.stars}, ${repos.stars})`;

const sortExpressionByKey: Record<TrendsSortKey, SQL> = {
  trending: sql`${repoTrends.popularityScore}`,
  daily: sql`${repoTrends.daily}`,
  weekly: sql`${repoTrends.weekly}`,
  monthly: sql`${repoTrends.monthly}`,
  yearly: sql`${repoTrends.yearly}`,
  "most-stars": starsExpression,
  "most-active": sql`${repoTrends.activityScore}`,
  // raw downloads, not `usage_score`: the log-scale score buckets projects
  // together (ties), raw counts give an exact order
  "most-used": sql`${projectTrends.monthlyDownloads}`,
  newest: sql`${projects.createdAt}`,
};

export interface FindProjectsWithTrendsOptions {
  db: DB;
  limit?: number;
  page?: number;
  /** Text search on project name/description and repo owner/name */
  query?: string;
  /**
   * Quality floor: keep only projects with `relevance_score >= 0`.
   * Disable to query the full catalog, including deprecated projects
   * with no meaningful signals (used by the `/search` route).
   */
  relevanceFloor?: boolean;
  sort?: TrendsSortKey;
  /** Keep only projects that have ALL the requested tags */
  tagCodes?: string[];
}

export type ProjectWithTrends = Awaited<
  ReturnType<typeof findProjectsWithTrends>
>["projects"][number];

/**
 * Web-facing variant of `findProjects()`, backed by the `repo_trends` and
 * `project_trends` cache tables populated daily by the backend tasks.
 * Projects added since the last daily run have no cache row and are not
 * returned; the admin app should keep using `findProjects()`.
 */
export async function findProjectsWithTrends({
  db,
  limit = 30,
  page = 1,
  query,
  relevanceFloor = true,
  sort = "most-stars",
  tagCodes,
}: FindProjectsWithTrendsOptions) {
  const offset = (page - 1) * limit;

  const where = and(
    relevanceFloor ? gte(projectTrends.relevanceScore, 0) : undefined,
    query ? getWhereClauseSearchByText(query) : undefined,
    tagCodes && tagCodes.length > 0
      ? getWhereClauseSearchByTag(db, tagCodes)
      : undefined,
  );

  const projectsQuery = db
    .select({
      slug: projects.slug,
      name: projects.name,
      description: projects.description,
      url: projects.url,
      createdAt: projects.createdAt,
      status: projects.status,
      logo: projects.logo,
      tags: sql<
        string[]
      >`COALESCE(json_agg(distinct ${tags.code}) FILTER (WHERE ${tags.code} IS NOT NULL), '[]')`, // avoid [null], return empty arrays instead
      repo: {
        full_name: sql<string>`${repos.owner} || '/' || ${repos.name}`,
        owner_id: repos.owner_id,
        archived: repos.archived,
        last_commit: repos.last_commit,
        contributor_count: repos.contributor_count,
      },
      stars: starsExpression,
      trends: {
        daily: repoTrends.daily,
        weekly: repoTrends.weekly,
        monthly: repoTrends.monthly,
        quarterly: repoTrends.quarterly,
        yearly: repoTrends.yearly,
      },
      popularityScore: repoTrends.popularityScore,
      activityScore: repoTrends.activityScore,
      usageScore: projectTrends.usageScore,
      relevanceScore: projectTrends.relevanceScore,
      packageName: projectTrends.packageName,
      monthlyDownloads: projectTrends.monthlyDownloads,
    })
    .from(projects)
    .innerJoin(repos, eq(projects.repoId, repos.id))
    .innerJoin(projectTrends, eq(projectTrends.projectId, projects.id))
    .leftJoin(repoTrends, eq(repoTrends.repoId, repos.id))
    .leftJoin(projectsToTags, eq(projectsToTags.projectId, projects.id))
    .leftJoin(tags, eq(projectsToTags.tagId, tags.id))
    .where(where)
    .groupBy(projects.id, repos.id, repoTrends.repoId, projectTrends.projectId)
    .orderBy(...getOrderByQuery(sort))
    .limit(limit)
    .offset(offset);

  const totalQuery = db
    .select({ count: count() })
    .from(projects)
    .innerJoin(repos, eq(projects.repoId, repos.id))
    .innerJoin(projectTrends, eq(projectTrends.projectId, projects.id))
    .leftJoin(repoTrends, eq(repoTrends.repoId, repos.id))
    .where(where);

  const [foundProjects, totalResults] = await Promise.all([
    projectsQuery,
    totalQuery,
  ]);

  return { projects: foundProjects, total: totalResults[0].count };
}

function getOrderByQuery(sort: TrendsSortKey) {
  const expression = sortExpressionByKey[sort];
  return [
    // Every sort option is descending; `NULLS LAST` keeps projects without
    // a `repo_trends` row (deprecated) at the bottom instead of the top.
    sql`${expression} desc nulls last`,
    // Tiebreaker to make pagination deterministic
    sql`${projects.slug} asc`,
  ];
}
