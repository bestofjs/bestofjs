import { cacheLife } from "next/cache";

import { db } from "@repo/core";
import {
  getProjectsStats,
  getRepoStarsByFullName,
} from "@repo/core/services/projects";

import { findProjectsWithTrends, findTags } from "@/app/db";
import {
  buildTagsByCode,
  toTrendsProject,
} from "@/app/projects/project-adapter";
import type { WebApp } from "@/config/apps";
import { APP_REPO_FULL_NAME } from "@/config/site";
import { cacheTagForApp } from "@/server/cache";

const NUMBER_OF_NEWEST_PROJECTS = 5;
const NUMBER_OF_POPULAR_TAGS = 10;

export async function getHomeData(app: WebApp) {
  "use cache";
  cacheLife("daily");
  cacheTagForApp(app, "daily", "home");
  const [{ projects: newestRows }, allTags, stats, bestOfJSStars] =
    await Promise.all([
      findProjectsWithTrends({
        limit: NUMBER_OF_NEWEST_PROJECTS,
        // "Recently Added" is a chronological feed of editorial admissions, not
        // a quality ranking — curation already happened when a human added the
        // project. `scope: "active"` would hide the newest entries of all:
        // until the daily GitHub commit-history fetch reaches a repo, its
        // `activity_score` is the `-100` sentinel, which the active filter
        // reads as "dead" rather than "unknown".
        scope: "all",
        sort: "newest",
      }),
      findTags(),
      getProjectsStats({ db }),
      getRepoStarsByFullName(db, APP_REPO_FULL_NAME),
    ]);

  const tagsByCode = buildTagsByCode(allTags);

  return {
    activeTotal: stats.activeTotal,
    bestOfJSStars,
    lastUpdateDate: stats.lastUpdateDate,
    newestProjects: newestRows.map((row) => toTrendsProject(row, tagsByCode)),
    // Sorted and sliced in JS from the same `findTags()` result the tag lookup
    // above uses: no second query, and the counts are *provably* the ones the
    // /tags page shows rather than merely intended to match.
    popularTags: allTags
      .toSorted((a, b) => b.count - a.count)
      .slice(0, NUMBER_OF_POPULAR_TAGS)
      .map((tag) => ({
        code: tag.code,
        name: tag.name,
        description: tag.description,
        counter: tag.count,
      })),
    total: stats.total,
  };
}
