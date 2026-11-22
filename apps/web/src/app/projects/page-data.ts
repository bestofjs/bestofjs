import { cacheLife } from "next/cache";

import { findProjectsWithTrends, findRelevantTags, findTags } from "@/app/db";
import type { WebApp } from "@/config/apps";
import { cacheTagForApp } from "@/server/cache";

import {
  buildTagsByCode,
  type TrendsProject,
  toTrendsProject,
} from "./project-adapter";
import type { TrendsProjectSearchState } from "./trends-project-search-state";
export type TagSummary = { code: string; name: string };

export type ProjectsPageData = {
  projects: TrendsProject[];
  total: number;
  selectedTags: TagSummary[];
  relevantTags: TagSummary[];
};

export async function fetchPageData(
  searchState: TrendsProjectSearchState,
  app: WebApp,
): Promise<ProjectsPageData> {
  "use cache";
  cacheLife("hours");
  cacheTagForApp(app, "projects");

  const { ai, tags: tagCodes, sort, page, limit, query, scope } = searchState;
  // `?ai=1` asks this deployment for the tags it hides; on the main deployment
  // there are none, so the flag is inert there.
  const showExcludedTags = ai === "1";

  const [{ projects: rows, total }, allTags, relevantTags] = await Promise.all([
    findProjectsWithTrends({
      limit,
      page,
      query,
      scope,
      showExcludedTags,
      sort,
      tagCodes,
    }),
    // Same opt-out as the listing: the heading, the removable tag chips and the
    // tag labels on the cards all read from this lookup.
    findTags({ showExcludedTags }),
    // Same `scope` as the listing: a suggested tag whose projects are all
    // filtered out would lead to an empty page.
    findRelevantTags({ tagCodes, query, scope, showExcludedTags }),
  ]);

  const tagsByCode = buildTagsByCode(allTags);
  const projects = rows.map((row) => toTrendsProject(row, tagsByCode));
  const selectedTags = allTags.filter((tag) => tagCodes.includes(tag.code));

  return {
    projects,
    total,
    selectedTags,
    relevantTags,
  };
}
