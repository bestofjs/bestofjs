"use cache"; // needed at the file level to avoid errors `Route "/" used `require('node:crypto').randomBytes(size)` before accessing either uncached data`
import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";

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
import { APP_REPO_FULL_NAME } from "@/config/site";
import { api } from "@/server/api-local-json";

import { getLatestProjects } from "../backend-search-requests";

export default async function TrendsLayout({
  children,
}: React.PropsWithChildren) {
  const {
    newestProjects,
    bestOfJSProject,
    popularTags,
    lastUpdateDate,
    total,
  } = await getData();
  return (
    <div className="flex flex-col gap-8">
      <HomeIntroSection />

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

      <Suspense fallback={<div>Loading...</div>}>
        <LatestMonthlyRankings />
      </Suspense>

      <Separator className="-mx-4 w-auto sm:mx-0" />

      <BestOfJSSection project={bestOfJSProject} />

      <Separator className="-mx-4 w-auto sm:mx-0" />

      <MoreProjectsSection lastUpdateDate={lastUpdateDate} total={total} />
    </div>
  );
}

async function getData() {
  cacheLife("daily");
  cacheTag("daily", "home");
  const { lastUpdateDate, total } = await api.projects.getStats();
  const { projects: newestProjects } = await api.projects.findProjects(
    getLatestProjects(),
  );
  const bestOfJSProject = await api.projects.findOne({
    full_name: APP_REPO_FULL_NAME,
  });
  const { tags: popularTags } = await api.tags.findTags({
    sort: { counter: -1 },
    limit: 10,
  });
  return {
    bestOfJSProject,
    lastUpdateDate,
    newestProjects,
    popularTags,
    total,
  };
}
