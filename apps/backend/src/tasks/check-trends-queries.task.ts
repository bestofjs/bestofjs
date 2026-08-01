import { z } from "zod";

import { TAGS_EXCLUDED_FROM_RANKINGS } from "@repo/db/constants";
import { getProjectLabel } from "@repo/db/project-trends";
import {
  findProjectsWithTrends,
  type ProjectWithTrends,
  resolveScope,
} from "@repo/db/projects";
import {
  type TrendsSortKey,
  trendsSortKeySchema,
} from "@repo/db/shared-schemas";

import { formatCompactNumber } from "@/shared/utils";
import { createTask } from "@/task-runner";

/**
 * Manual test for the web listing queries, to be run by devs against the
 * local or production database. Prints the results of
 * `findProjectsWithTrends()` for the given flags and checks invariants that
 * fixtures-free testing can verify on real data:
 * - relevance floor: when the legacy floored view is selected (`--no-fullCatalog`),
 *   no shown project has `relevance_score < 0`
 * - sort order: values non-increasing, NULLs (missing `repo_trends` row) last
 * - tag filter: every result has ALL the requested tags
 * - excluded tag filter: no result carries ANY of the excluded tags
 * - the full catalog is never smaller than the floored listing
 */
export const checkTrendsQueriesTask = createTask({
  name: "check-trends-queries",
  description:
    "Manual test for `findProjectsWithTrends()`: print a web listing query result and check its invariants",
  flags: {
    sort: {
      type: String,
      description:
        "Sort option: trending, daily, weekly, monthly, yearly, most-stars, most-active, last-commit, contributors, monthly-downloads, created, newest",
      default: "most-stars",
    },
    tags: {
      type: String,
      description: "Comma-separated tag codes; projects must have ALL of them",
    },
    excludeTags: {
      type: String,
      description:
        "Comma-separated tag codes; projects must have NONE of them. Pass 'rankings' for the home/trends exclusion (TAGS_EXCLUDED_FROM_RANKINGS).",
    },
    search: {
      type: String,
      description:
        "Text search on project name/description and repo owner/name",
    },
    fullCatalog: {
      type: Boolean,
      description:
        "Show the full catalog with the relevance floor disabled — the live site default. Pass --no-fullCatalog to preview the legacy floored listing.",
      default: true,
    },
    scope: {
      type: String,
      description:
        "Which projects to show, as the web listing's `scope` param: 'active' (the site default — hides deprecated, inactive and cold projects) or 'all'.",
      default: "active",
    },
    page: {
      type: Number,
      description: "Page number",
      default: 1,
    },
    columns: {
      type: String,
      description:
        "Comma-separated columns to show, or 'all'. Default: rank,slug,stars,downloads,relevance",
    },
  },
  schema: z.object({
    sort: trendsSortKeySchema.optional().default("most-stars"),
    tags: z.string().optional(),
    excludeTags: z.string().optional(),
    search: z.string().optional(),
    fullCatalog: z.boolean().optional().default(true),
    scope: z.enum(["all", "active"]).optional().default("active"),
    page: z.number().optional().default(1),
    limit: z.number().optional().default(0), // shared flag; 0 means "not provided"
    columns: z.string().optional(),
  }),
  run: async ({ db, logger }, flags) => {
    const { sort, search, fullCatalog, scope, page } = flags;
    const limit = flags.limit || 25;
    const tagCodes = parseTagCodes(flags.tags);
    // `--excludeTags rankings` is a shorthand for the exclusion the home page
    // and the /trends pages apply, so it can be checked without retyping it.
    const excludeTagCodes =
      flags.excludeTags === "rankings"
        ? TAGS_EXCLUDED_FROM_RANKINGS
        : parseTagCodes(flags.excludeTags);

    const options = {
      db,
      sort,
      query: search,
      tagCodes,
      excludeTagCodes,
      page,
      limit,
      scope,
    };
    // A text search always searches the whole catalog, whatever `--scope` says.
    const effectiveScope = resolveScope(scope, search);
    const [floored, full, scopeAll] = await Promise.all([
      findProjectsWithTrends({ ...options, relevanceFloor: true }),
      findProjectsWithTrends({ ...options, relevanceFloor: false }),
      // Only to report how much the scope filter removes — the web listing
      // doesn't need this, `scope` is just another filter there.
      effectiveScope === "active"
        ? findProjectsWithTrends({ ...options, scope: "all", limit: 1 })
        : undefined,
    ]);
    const { projects, total } = fullCatalog ? full : floored;

    const requestedColumns = resolveColumns(flags.columns);
    if (requestedColumns.unknown.length > 0) {
      logger.warn(
        `Unknown column(s): ${requestedColumns.unknown.join(", ")}. Valid: ${Object.keys(COLUMNS).join(", ")}`,
      );
    }

    console.table(
      projects.map((project, index) => {
        const ctx: RowContext = { index, page, limit };
        const row: Record<string, unknown> = {};
        for (const col of requestedColumns.columns) {
          row[col] = COLUMNS[col](project, ctx);
        }
        return row;
      }),
    );
    logger.info(
      `${projects.length} projects shown (page ${page}), ${total} matching in total`,
    );
    if (scopeAll) {
      logger.info(
        `The "active" scope hides ${scopeAll.total - total} of the ${scopeAll.total} matching projects (deprecated, inactive or cold)`,
      );
    }
    logger.info(
      `The relevance floor hides ${full.total - floored.total} of the ${full.total} matching projects`,
    );

    const violations = [
      ...checkRelevanceFloor(projects, fullCatalog),
      ...checkScope(projects, effectiveScope),
      ...checkSortOrder(projects, sort),
      ...checkTagFilter(projects, tagCodes),
      ...checkExcludedTagFilter(projects, excludeTagCodes),
      ...(full.total >= floored.total
        ? []
        : [
            `Full catalog total (${full.total}) is smaller than the floored total (${floored.total})`,
          ]),
    ];

    for (const violation of violations) {
      logger.error("Invariant violated:", violation);
    }
    if (violations.length === 0) {
      logger.success("All invariants hold");
    }

    return {
      data: null,
      meta: { total, shown: projects.length, error: violations.length },
    };
  },
});

function checkRelevanceFloor(
  projects: ProjectWithTrends[],
  fullCatalog: boolean,
) {
  if (fullCatalog) return [];
  return projects
    .filter(
      (project) =>
        project.relevanceScore !== null && project.relevanceScore < 0,
    )
    .map(
      (project) =>
        `"${project.slug}" has a negative relevance score (${project.relevanceScore}) but the floor is enabled`,
    );
}

/**
 * The `scope: "active"` filter is expressed in SQL while the badge that names
 * the same projects is expressed in TypeScript, so the two can drift. This
 * catches that directly: under the filter, no row may carry a warning badge.
 */
function checkScope(projects: ProjectWithTrends[], scope: "all" | "active") {
  if (scope === "all") return [];
  return projects
    .map((project) => ({
      project,
      label: getProjectLabel({
        status: project.status,
        activityScore: project.activityScore,
        yearlyStars: project.trends?.yearly,
      }),
    }))
    .filter(({ label }) => label !== null)
    .map(
      ({ project, label }) =>
        `"${project.slug}" is labelled "${label}" but the "active" scope should have hidden it`,
    );
}

// "created" means oldest-GitHub-repo-first; every other sort is descending.
const ASCENDING_SORT_KEYS: TrendsSortKey[] = ["created"];

function checkSortOrder(projects: ProjectWithTrends[], sort: TrendsSortKey) {
  const ascending = ASCENDING_SORT_KEYS.includes(sort);
  const violations: string[] = [];
  let previous: number | undefined;
  let seenNull = false;
  for (const project of projects) {
    const value = getSortValue(project, sort);
    if (value === null) {
      seenNull = true;
      continue;
    }
    if (seenNull) {
      violations.push(
        `"${project.slug}" has a "${sort}" value but is ranked after projects without one (NULLS LAST violated)`,
      );
      continue;
    }
    if (previous !== undefined) {
      const outOfOrder = ascending ? value < previous : value > previous;
      if (outOfOrder) {
        violations.push(
          `"${project.slug}" (${value}) is ranked after a project with a ${ascending ? "higher" : "lower"} "${sort}" value (${previous})`,
        );
      }
    }
    previous = value;
  }
  return violations;
}

function getSortValue(project: ProjectWithTrends, sort: TrendsSortKey) {
  switch (sort) {
    case "trending":
      return project.popularityScore;
    case "daily":
      return project.trends?.daily ?? null;
    case "weekly":
      return project.trends?.weekly ?? null;
    case "monthly":
      return project.trends?.monthly ?? null;
    case "yearly":
      return project.trends?.yearly ?? null;
    case "most-stars":
      return project.stars;
    case "most-active":
      return project.activityScore;
    case "last-commit":
      return project.repo.last_commit?.getTime() ?? null;
    case "contributors":
      return project.repo.contributor_count ?? null;
    case "monthly-downloads":
      return project.monthlyDownloads;
    case "created":
      return project.repo.created_at.getTime();
    case "newest":
      return project.createdAt.getTime();
  }
}

function checkTagFilter(projects: ProjectWithTrends[], tagCodes?: string[]) {
  if (!tagCodes || tagCodes.length === 0) return [];
  return projects
    .filter(
      (project) => !tagCodes.every((tagCode) => project.tags.includes(tagCode)),
    )
    .map(
      (project) =>
        `"${project.slug}" is missing one of the requested tags (found: ${project.tags.join(", ")})`,
    );
}

function checkExcludedTagFilter(
  projects: ProjectWithTrends[],
  excludeTagCodes?: string[],
) {
  if (!excludeTagCodes || excludeTagCodes.length === 0) return [];
  return projects
    .filter((project) =>
      excludeTagCodes.some((tagCode) => project.tags.includes(tagCode)),
    )
    .map(
      (project) =>
        `"${project.slug}" carries an excluded tag (found: ${project.tags.join(", ")})`,
    );
}

function parseTagCodes(raw: string | undefined) {
  return raw
    ?.split(",")
    .map((code) => code.trim())
    .filter(Boolean);
}

function roundScore(score: number | null) {
  return score === null ? null : Math.round(score * 10) / 10;
}

type RowContext = { index: number; page: number; limit: number };

const COLUMNS = {
  rank: (_p: ProjectWithTrends, { index, page, limit }: RowContext) =>
    (page - 1) * limit + index + 1,
  slug: (p: ProjectWithTrends) => p.slug,
  status: (p: ProjectWithTrends) => p.status,
  stars: (p: ProjectWithTrends) => formatCompactNumber(p.stars),
  daily: (p: ProjectWithTrends) => p.trends?.daily ?? null,
  weekly: (p: ProjectWithTrends) => p.trends?.weekly ?? null,
  monthly: (p: ProjectWithTrends) =>
    formatCompactNumber(p.trends?.monthly ?? null),
  yearly: (p: ProjectWithTrends) =>
    formatCompactNumber(p.trends?.yearly ?? null),
  downloads: (p: ProjectWithTrends) => formatCompactNumber(p.monthlyDownloads),
  relevance: (p: ProjectWithTrends) => roundScore(p.relevanceScore),
  popularity: (p: ProjectWithTrends) => roundScore(p.popularityScore),
  activity: (p: ProjectWithTrends) => roundScore(p.activityScore),
  usage: (p: ProjectWithTrends) => roundScore(p.usageScore),
  contributors: (p: ProjectWithTrends) => p.repo.contributor_count,
  lastCommit: (p: ProjectWithTrends) =>
    p.repo.last_commit?.toISOString().slice(0, 10) ?? null,
  createdAt: (p: ProjectWithTrends) =>
    p.repo.created_at.toISOString().slice(0, 10),
  tags: (p: ProjectWithTrends) => p.tags.join(", "),
  // The badge the web listing renders for this row, so thresholds can be
  // eyeballed across the whole catalog before tuning them in the browser.
  label: (p: ProjectWithTrends) =>
    getProjectLabel({
      status: p.status,
      activityScore: p.activityScore,
      yearlyStars: p.trends?.yearly,
    }),
} as const satisfies Record<
  string,
  (p: ProjectWithTrends, ctx: RowContext) => unknown
>;

type ColumnKey = keyof typeof COLUMNS;

const DEFAULT_COLUMNS: ColumnKey[] = [
  "rank",
  "slug",
  "stars",
  "downloads",
  "relevance",
];

function resolveColumns(raw: string | undefined): {
  columns: ColumnKey[];
  unknown: string[];
} {
  if (!raw) return { columns: DEFAULT_COLUMNS, unknown: [] };
  if (raw === "all") {
    return { columns: Object.keys(COLUMNS) as ColumnKey[], unknown: [] };
  }
  const requested = raw
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  const known = Object.keys(COLUMNS);
  const columns: ColumnKey[] = [];
  const unknown: string[] = [];
  for (const c of requested) {
    if (known.includes(c)) columns.push(c as ColumnKey);
    else unknown.push(c);
  }
  return { columns, unknown };
}
