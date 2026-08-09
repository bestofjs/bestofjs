import {
  and,
  count,
  eq,
  gte,
  isNull,
  ne,
  or,
  type SQL,
  sql,
} from "drizzle-orm";

import type { ProjectStatus } from "../../constants";
import type { DB } from "../../index";
import * as schema from "../../schema";
import type { TrendsSortKey } from "../../shared-schemas";
import {
  COLD_YEARLY_STARS,
  INACTIVE_ACTIVITY_SCORE,
} from "../project-trends/labels";
import {
  getWhereClauseExcludeTags,
  getWhereClauseSearchByPackageName,
  getWhereClauseSearchByTag,
  getWhereClauseSearchByText,
} from "./find";

const { projects, projectTrends, projectsToTags, repos, repoTrends, tags } =
  schema;

/**
 * Deprecated projects have no `repo_trends` row (deleted by the daily cleanup
 * task), so fall back to the canonical GitHub star count from `repos`.
 *
 * Exported so single-project queries that join the same two tables (the OG
 * image route's `getProjectCardData()`) reuse the fallback instead of restating
 * it and quietly showing `null` stars for a deprecated project.
 */
export const starsExpression = sql<number>`COALESCE(${repoTrends.stars}, ${repos.stars})`;

const sortExpressionByKey: Record<TrendsSortKey, SQL> = {
  trending: sql`${repoTrends.popularityScore}`,
  daily: sql`${repoTrends.daily}`,
  weekly: sql`${repoTrends.weekly}`,
  monthly: sql`${repoTrends.monthly}`,
  yearly: sql`${repoTrends.yearly}`,
  "most-stars": starsExpression,
  "most-active": sql`${repoTrends.activityScore}`,
  "last-commit": sql`${repos.last_commit}`,
  contributors: sql`${repos.contributor_count}`,
  // raw downloads, not `usage_score`: the log-scale score buckets projects
  // together (ties), raw counts give an exact order
  "monthly-downloads": sql`${projectTrends.monthlyDownloads}`,
  // ascending: oldest GitHub repo first (see `getOrderByQuery`)
  created: sql`${repos.created_at}`,
  newest: sql`${projects.createdAt}`,
};

/**
 * `"active"` hides every project the UI would badge as a warning — deprecated,
 * inactive (over a year without a commit) or cold (under 50 new stars in a
 * year). It is the honest, switchable successor to the old static API's veto
 * rules, and the default: `"all"` opts into the complete catalog.
 *
 * **A text `query` overrides this to `"all"`** — see `resolveScope()`.
 */
export type ProjectScope = "all" | "active";

/**
 * Browsing is curated; searching is not. Someone typing a name is looking for
 * one specific project, and hiding it because it is deprecated or unmaintained
 * makes the search look broken — the palette's "Search all projects" fallback
 * exists precisely to reach those projects, and its own index already excludes
 * deprecated ones.
 *
 * The rule lives here rather than in each caller so the listing page, the OG
 * image route and the `check-trends-queries` task cannot disagree about it.
 */
export function resolveScope(
  scope: ProjectScope,
  query?: string,
): ProjectScope {
  return query ? "all" : scope;
}

/**
 * Keeps only projects with no warning badge. Written as three independent
 * "pass" conditions rather than `NOT (a OR b OR c)` on purpose: in SQL's
 * three-valued logic, a project with no `repo_trends` row yet (added since the
 * last daily run) makes that negation `NULL` and vanishes from the listing.
 * Null scores mean "not computed yet", which is not a reason to hide anything —
 * the same rule `getProjectLabel()` follows when it renders no badge.
 */
export function getWhereClauseActiveScope() {
  return and(
    ne(projects.status, "deprecated"),
    or(
      isNull(repoTrends.activityScore),
      gte(repoTrends.activityScore, INACTIVE_ACTIVITY_SCORE),
    ),
    or(isNull(repoTrends.yearly), gte(repoTrends.yearly, COLD_YEARLY_STARS)),
  );
}

export interface FindProjectsWithTrendsOptions {
  db: DB;
  /**
   * Drop projects carrying ANY of these tag codes. Editorial, not quality:
   * the home page and the `/trends/*` rankings pass
   * `TAGS_EXCLUDED_FROM_RANKINGS` so meta/learning projects don't crowd out
   * libraries. The `/projects` listing deliberately does not — see
   * `docs/architecture/web-app.md`.
   */
  excludeTagCodes?: string[];
  limit?: number;
  /**
   * Keep only projects owning ANY of these npm package names, primary or
   * secondary — matched against the `packages` table, not the single
   * `project_trends.package_name`. Used by the project detail page's dependency
   * list.
   */
  packageNames?: string[];
  page?: number;
  /** Text search on project name/description and repo owner/name */
  query?: string;
  /**
   * Quality view: `"active"` (default) hides badged projects, `"all"` shows
   * everything. Ignored when `query` is set — text search always searches the
   * whole catalog.
   */
  scope?: ProjectScope;
  /**
   * Quality floor: keep only projects with `relevance_score >= 0`.
   * Off by default — the public listing/search shows the full catalog
   * (curation lives in sort order + visible badges, not a numeric cutoff).
   * Enable to opt into a "hide low-signal projects" view.
   */
  relevanceFloor?: boolean;
  sort?: TrendsSortKey;
  /**
   * Editorial status filter, ANDed with `scope`. A single value rather than an
   * array: the one caller (`/featured`) wants exactly one, and widening it
   * later is a one-line change.
   */
  status?: ProjectStatus;
  /** Keep only projects that have ALL the requested tags */
  tagCodes?: string[];
}

export type ProjectWithTrends = Awaited<
  ReturnType<typeof findProjectsWithTrends>
>["projects"][number];

/**
 * Web-facing variant of `findProjects()`, backed by the `repo_trends` and
 * `project_trends` cache tables populated daily by the backend tasks.
 * `project_trends` is LEFT-joined, so projects added since the last daily run
 * (no cache row yet) are still returned, with null scores — this keeps the
 * listing count equal to the tag count. The admin app keeps using
 * `findProjects()`.
 */
export async function findProjectsWithTrends({
  db,
  excludeTagCodes,
  limit = 30,
  packageNames,
  page = 1,
  query,
  relevanceFloor = false,
  scope = "active",
  sort = "most-stars",
  status,
  tagCodes,
}: FindProjectsWithTrendsOptions) {
  const offset = (page - 1) * limit;

  // Everything except the scope filter, so the unfiltered total can reuse it.
  const baseWhere = and(
    relevanceFloor ? gte(projectTrends.relevanceScore, 0) : undefined,
    status ? eq(projects.status, status) : undefined,
    query ? getWhereClauseSearchByText(query) : undefined,
    packageNames && packageNames.length > 0
      ? getWhereClauseSearchByPackageName(db, packageNames)
      : undefined,
    tagCodes && tagCodes.length > 0
      ? getWhereClauseSearchByTag(db, tagCodes)
      : undefined,
    excludeTagCodes && excludeTagCodes.length > 0
      ? getWhereClauseExcludeTags(db, excludeTagCodes)
      : undefined,
  );

  const where = and(
    baseWhere,
    resolveScope(scope, query) === "active"
      ? getWhereClauseActiveScope()
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
        created_at: repos.created_at,
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
    .leftJoin(projectTrends, eq(projectTrends.projectId, projects.id))
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
    .leftJoin(projectTrends, eq(projectTrends.projectId, projects.id))
    .leftJoin(repoTrends, eq(repoTrends.repoId, repos.id))
    .where(where);

  const [foundProjects, totalResults] = await Promise.all([
    projectsQuery,
    totalQuery,
  ]);

  // `total` counts what the current filters match, `scope` included — it is a
  // filter like `tagCodes` or `query`, not a window onto a larger set.
  return { projects: foundProjects, total: totalResults[0].count };
}

function getOrderByQuery(sort: TrendsSortKey) {
  const expression = sortExpressionByKey[sort];
  const primary =
    // "created" is the one sort that means "oldest first"; `repos.created_at`
    // is NOT NULL so no nulls-handling is needed. Every other sort is
    // descending, with `NULLS LAST` keeping projects without a `repo_trends`
    // row (deprecated) at the bottom instead of the top.
    sort === "created"
      ? sql`${expression} asc`
      : sql`${expression} desc nulls last`;
  return [
    primary,
    // Tiebreaker to make pagination deterministic
    sql`${projects.slug} asc`,
  ];
}
