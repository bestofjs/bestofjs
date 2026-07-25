import type { ProjectWithTrends } from "@repo/db/projects";

/**
 * `BestOfJS.Project` shape plus the two trends-only scores (`popularityScore`,
 * `activityScore`) that don't exist on the shared static-JSON type — kept as a
 * local intersection rather than widening `BestOfJS.Project` for every consumer.
 */
export type TrendsProject = BestOfJS.Project & {
  popularityScore: number | null;
  activityScore: number | null;
};

/** Matches the pre-migration static API's `formatDate()` (`YYYY-MM-DD`). */
function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Adapts a `findProjectsWithTrends()` row (nested `repo.*`, tag codes as plain
 * strings) into the flat `BestOfJS.Project` shape the existing list/table/tag
 * components already render, so those components don't need to change.
 */
export function toTrendsProject(
  row: ProjectWithTrends,
  tagsByCode: Map<string, BestOfJS.Tag>,
): TrendsProject {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    // `added_at` = Best of JS addition date (`projects.created_at`);
    // `created_at` = GitHub repo creation date (`repos.created_at`), matching
    // the pre-migration static API and the "Created" sort key.
    // Both are serialized as `YYYY-MM-DD` to preserve shape parity with the
    // static JSON (`build-static-api.task.ts`'s `formatDate()`).
    added_at: formatDateOnly(row.createdAt),
    created_at: formatDateOnly(row.repo.created_at),
    full_name: row.repo.full_name,
    owner_id: row.repo.owner_id,
    pushed_at: row.repo.last_commit ? formatDateOnly(row.repo.last_commit) : "",
    contributor_count: row.repo.contributor_count ?? 0,
    stars: row.stars,
    // LEFT JOIN repo_trends: null for deprecated repos (no daily tracking);
    // individual deltas can also be null before a repo's first full window.
    trends: row.trends
      ? {
          daily: row.trends.daily ?? undefined,
          weekly: row.trends.weekly ?? undefined,
          monthly: row.trends.monthly ?? undefined,
          quarterly: row.trends.quarterly ?? undefined,
          yearly: row.trends.yearly ?? undefined,
        }
      : {},
    npm: row.packageName ?? "",
    downloads: row.monthlyDownloads ?? 0,
    logo: row.logo ?? "",
    url: row.url ?? "",
    status: row.status,
    tags: row.tags
      .map((code) => tagsByCode.get(code))
      .filter((tag): tag is BestOfJS.Tag => Boolean(tag)),
    popularityScore: row.popularityScore,
    activityScore: row.activityScore,
  };
}

/** Builds the `code -> Tag` lookup `toTrendsProject()` needs, from `findTags()`'s result. */
export function buildTagsByCode(
  allTags: readonly {
    code: string;
    name: string;
    description: string | null;
    count: number;
  }[],
): Map<string, BestOfJS.Tag> {
  return new Map(
    allTags.map((tag) => [
      tag.code,
      {
        code: tag.code,
        name: tag.name,
        description: tag.description,
        counter: tag.count,
      },
    ]),
  );
}
