import { z } from "zod";

import {
  findProjectsWithTrends,
  type ProjectWithTrends,
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
 * - relevance floor: no project with `relevance_score < 0` unless `--fullCatalog`
 * - sort order: values non-increasing, NULLs (missing `repo_trends` row) last
 * - tag filter: every result has ALL the requested tags
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
    search: {
      type: String,
      description:
        "Text search on project name/description and repo owner/name",
    },
    fullCatalog: {
      type: Boolean,
      description:
        "Disable the relevance-score floor, querying the full catalog (`/search` mode)",
      default: false,
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
    search: z.string().optional(),
    fullCatalog: z.boolean().optional().default(false),
    page: z.number().optional().default(1),
    limit: z.number().optional().default(0), // shared flag; 0 means "not provided"
    columns: z.string().optional(),
  }),
  run: async ({ db, logger }, flags) => {
    const { sort, search, fullCatalog, page } = flags;
    const limit = flags.limit || 25;
    const tagCodes = flags.tags
      ?.split(",")
      .map((code) => code.trim())
      .filter(Boolean);

    const options = {
      db,
      sort,
      query: search,
      tagCodes,
      page,
      limit,
    };
    const [floored, full] = await Promise.all([
      findProjectsWithTrends({ ...options, relevanceFloor: true }),
      findProjectsWithTrends({ ...options, relevanceFloor: false }),
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
    logger.info(
      `The relevance floor hides ${full.total - floored.total} of the ${full.total} matching projects`,
    );

    const violations = [
      ...checkRelevanceFloor(projects, fullCatalog),
      ...checkSortOrder(projects, sort),
      ...checkTagFilter(projects, tagCodes),
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
    .filter((project) => project.relevanceScore < 0)
    .map(
      (project) =>
        `"${project.slug}" has a negative relevance score (${project.relevanceScore}) but the floor is enabled`,
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
