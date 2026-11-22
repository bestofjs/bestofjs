import { Suspense } from "react";
import { cacheLife } from "next/cache";

import { ProjectListCardLoading } from "@/app/projects/loading-state";
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
import { cacheTagForApp } from "@/server/cache";

import { getHomeData } from "./page-data";

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
  } = await getHomeData(app);
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
