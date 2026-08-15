import { db } from "@repo/core";
import {
  type FindProjectsWithTrendsOptions,
  findProjectsWithTrends as findProjectsWithTrendsQuery,
  ProjectService,
} from "@repo/core/services/projects";
import {
  type FindRelevantTagsOptions,
  findRelevantTags as findRelevantTagsQuery,
  findTags as findTagsQuery,
  findTagsWithProjects as findTagsWithProjectsQuery,
  findTagWithProjects as findTagWithProjectsQuery,
} from "@repo/core/services/tags";

import { excludedTagCodes } from "@/config/apps";

/** Export a singleton to avoid creating too many connections */
export const projectService = new ProjectService(db);

/**
 * The app's data façade: every listing query the pages use, pre-bound to `db`
 * and to the tags this deployment hides (`@/config/apps`).
 *
 * Pages import from here rather than from `@repo/core/services/*` so that
 * "which tags does this deployment exclude" is decided in exactly one place.
 * Passing it per call site instead would fail silently — a page that forgot it
 * looks completely normal, it just serves the projects the deployment exists to
 * hide. Core stays deployment-agnostic: it takes `excludedTagCodes` as an
 * ordinary query parameter, which the admin app will pass from its own UI.
 */

/**
 * Editorial exclusions (`TAGS_EXCLUDED_FROM_RANKINGS`) and deployment
 * exclusions are merged, never substituted — a caller passing its own list is
 * narrowing the result further, not opting out of this deployment's identity.
 */
function mergeExcludedTags(callerTagCodes?: string[], optOut = false) {
  const merged = [
    ...(optOut ? [] : excludedTagCodes),
    ...(callerTagCodes ?? []),
  ];
  return merged.length > 0 ? merged : undefined;
}

/**
 * `showExcludedTags` is the `/projects` `?ai=1` opt-out — the one place a page
 * may ask for this deployment's hidden tags back. It never disables the
 * caller's own `excludedTagCodes` (the editorial ranking exclusion), only the
 * deployment's.
 */
type AppQueryOptions = { showExcludedTags?: boolean };

export function findProjectsWithTrends({
  showExcludedTags,
  ...options
}: Omit<FindProjectsWithTrendsOptions, "db"> & AppQueryOptions) {
  return findProjectsWithTrendsQuery({
    ...options,
    db,
    excludedTagCodes: mergeExcludedTags(
      options.excludedTagCodes,
      showExcludedTags,
    ),
  });
}

export function findRelevantTags({
  showExcludedTags,
  ...options
}: Omit<FindRelevantTagsOptions, "db"> & AppQueryOptions) {
  return findRelevantTagsQuery({
    ...options,
    db,
    excludedTagCodes: mergeExcludedTags(
      options.excludedTagCodes,
      showExcludedTags,
    ),
  });
}

export function findTags() {
  return findTagsQuery({ excludedTagCodes: mergeExcludedTags() });
}

export function findTagsWithProjects(
  options?: Parameters<typeof findTagsWithProjectsQuery>[0],
) {
  return findTagsWithProjectsQuery({
    ...options,
    excludedTagCodes: mergeExcludedTags(options?.excludedTagCodes),
  });
}

export function findTagWithProjects(
  code: string,
  options?: Parameters<typeof findTagWithProjectsQuery>[1],
) {
  return findTagWithProjectsQuery(code, {
    ...options,
    excludedTagCodes: mergeExcludedTags(options?.excludedTagCodes),
  });
}
