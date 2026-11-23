import { cacheLife } from "next/cache";

import { findProjectsWithTrends, findTags } from "@/app/db";
import {
  buildTagsByCode,
  toTrendsProject,
} from "@/app/projects/project-adapter";
import {
  type TrendsProjectSearchState,
  TrendsProjectSearchStateParser,
} from "@/app/projects/trends-project-search-state";
import type { WebApp } from "@/config/apps";
import { cacheTagForApp } from "@/server/cache";
export const searchStateParser = new TrendsProjectSearchStateParser({
  sort: "newest",
  scope: "all",
});
searchStateParser.path = "/featured";

export async function fetchFeaturedProjects(
  searchState: TrendsProjectSearchState,
  app: WebApp,
) {
  "use cache";
  cacheLife("hours");
  cacheTagForApp(app, "projects");

  const { sort, page, limit } = searchState;

  const [{ projects: rows, total }, allTags] = await Promise.all([
    findProjectsWithTrends({
      limit,
      page,
      // Hardcoded, not read from `searchState`: "featured" is an editorial
      // signal, and `status: "featured"` already excludes deprecated projects
      // (`projects.status` is a single enum column). `"active"` would only
      // *additionally* hide featured projects that went cold or quiet — exactly
      // the ones a curator needs listed — and would hide freshly-added ones
      // until their first commit-history fetch replaces the
      // `activity_score = -100` sentinel.
      scope: "all",
      sort,
      status: "featured",
    }),
    findTags(),
  ]);

  const tagsByCode = buildTagsByCode(allTags);

  return {
    projects: rows.map((row) => toTrendsProject(row, tagsByCode)),
    total,
  };
}
