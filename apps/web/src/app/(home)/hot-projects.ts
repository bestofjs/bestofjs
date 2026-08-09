import { cacheLife, cacheTag } from "next/cache";

import { db } from "@repo/core";
import { TAGS_EXCLUDED_FROM_RANKINGS } from "@repo/core/constants";
import { findProjectsWithTrends } from "@repo/core/projects";
import { findTags } from "@repo/core/tags";

import {
  buildTagsByCode,
  type TrendsProject,
  toTrendsProject,
} from "@/app/projects/project-adapter";

/** The four star-delta windows the home page's time range picker offers. */
export type HotProjectsSortKey = "daily" | "weekly" | "monthly" | "yearly";

/**
 * "Hot Projects" for one time window, shared by the home page, the three
 * `/trends/*` pages and the `/api/og` image — so the home page and its own
 * social preview cannot derive the ranking two different ways.
 *
 * `scope: "all"` on purpose. Scope is provably inert on a star-delta ranking:
 * a project topping one cannot be cold (that means under 50 new stars in a
 * year) and "inactive" describes decline, which contradicts leading a growth
 * ranking. The ranking *is* the quality signal here, so gating it again would
 * be redundant — and would risk a top-5 hole from the `activity_score = -100`
 * sentinel a repo carries until its first GitHub commit-history fetch.
 *
 * `excludeTagCodes` reproduces the pre-migration static API's editorial
 * exclusion, which applied to the home page and the rankings only.
 */
export async function getHotProjects(
  sort: HotProjectsSortKey,
  limit = 5,
): Promise<TrendsProject[]> {
  "use cache";
  cacheLife("daily");
  cacheTag("daily", "home");

  const [{ projects: rows }, allTags] = await Promise.all([
    findProjectsWithTrends({
      db,
      excludeTagCodes: TAGS_EXCLUDED_FROM_RANKINGS,
      limit,
      scope: "all",
      sort,
    }),
    findTags(),
  ]);

  const tagsByCode = buildTagsByCode(allTags);
  return rows.map((row) => toTrendsProject(row, tagsByCode));
}
