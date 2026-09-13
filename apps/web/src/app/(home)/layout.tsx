import { Suspense } from "react";
import { cacheLife } from "next/cache";

import { db } from "@repo/core";
import {
  getProjectsStats,
  getRepoStarsByFullName,
} from "@repo/core/services/projects";

import { findProjectsWithTrends, findTags } from "@/app/db";
import { ProjectListCardLoading } from "@/app/projects/loading-state";
import {
  buildTagsByCode,
  toTrendsProject,
} from "@/app/projects/project-adapter";
import { FeaturedProjects } from "@/components/home/home-featured-projects";
import { HomeIntroSection } from "@/components/home/home-intro-section";
import {
  BestOfJSSection,
  MoreProjectsSection,
  NewestProjectList,
  PopularTagsList,
} from "@/components/home/home-sections";
import { LatestMonthlyRankings } from "@/components/home/latest-monthly-rankings";
import { Separator } from "@/components/ui/separator";
import { currentApp, type WebApp } from "@/config/apps";
import { APP_REPO_FULL_NAME } from "@/config/site";
import { cacheTagForApp } from "@/server/cache";

export default async function TrendsLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <div className="flex flex-col gap-8">
      <HomeIntroSection />

      <Suspense fallback={<ProjectListCardLoading />}>
        <TrendsLayoutMain>{children}</TrendsLayoutMain>
      </Suspense>
    </div>
  );
}

async function TrendsLayoutMain({ children }: React.PropsWithChildren) {
  return renderTrendsLayoutMain(currentApp, children);
}

// A component rendered as JSX can't take extra arguments, so the cached
// rendering is split into this inner function: `app` needs to be a real
// parameter (not a module-scope import) since Next's "use cache" excludes
// module-scope values from the cache key (github.com/vercel/next.js#74498).
// This is also the sole cache boundary needed to satisfy PPR's requirement
// that a cached function run before any dynamic API is accessed in this route
// (see the old file-level `"use cache"` this replaced).
async function renderTrendsLayoutMain(app: WebApp, children: React.ReactNode) {
  "use cache";
  cacheLife("daily");
  cacheTagForApp(app, "daily", "home");

  const {
    activeTotal,
    bestOfJSStars,
    lastUpdateDate,
    newestProjects,
    popularTags,
    total,
  } = await getData();
  return (
    <>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-8">
          {children}
          <NewestProjectList projects={newestProjects} />
        </div>
        <div className="shrink-0 space-y-8 lg:w-[300px]">
          <FeaturedProjects />
          <PopularTagsList tags={popularTags} />
        </div>
      </div>

      <LatestMonthlyRankings />

      <Separator className="-mx-4 w-auto sm:mx-0" />

      <BestOfJSSection stars={bestOfJSStars} />

      <Separator className="-mx-4 w-auto sm:mx-0" />

      <MoreProjectsSection
        activeTotal={activeTotal}
        lastUpdateDate={lastUpdateDate}
        total={total}
      />
    </>
  );
}

const NUMBER_OF_NEWEST_PROJECTS = 5;
const NUMBER_OF_POPULAR_TAGS = 10;

async function getData() {
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
