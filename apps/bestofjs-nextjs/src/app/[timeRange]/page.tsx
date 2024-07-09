import { Metadata } from "next";
import NextLink from "next/link";
import { GoFlame, GoGift, GoHeart, GoPlus } from "react-icons/go";

import {
  ADD_PROJECT_REQUEST_URL,
  APP_CANONICAL_URL,
  APP_DESCRIPTION,
  APP_DISPLAY_NAME,
  APP_REPO_FULL_NAME,
  APP_REPO_URL,
  SPONSOR_URL,
} from "@/config/site";
import { formatNumber } from "@/helpers/numbers";
import { addCacheBustingParam } from "@/helpers/url";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StarIcon, TagIcon } from "@/components/core";
import { SectionHeading } from "@/components/core/section";
import { ExternalLink } from "@/components/core/typography";
import { FeaturedProjects } from "@/components/home/home-featured-projects";
import {
  HotProjectList,
  getHotProjects,
} from "@/components/home/home-hot-projects";
import { LatestMonthlyRankings } from "@/components/home/latest-monthly-rankings";
import { TypeWriter } from "@/components/home/typewriter";
import { ProjectPageSearchParams } from "@/components/project-list/navigation-state";
import { HotProjectSortOrderPicker } from "@/components/project-list/project-sort-order-picker";
import {
  ProjectScore,
  ProjectTable,
} from "@/components/project-list/project-table";
import {
  SortOptionKey,
  sortOrderOptionsByKey,
} from "@/components/project-list/sort-order-options";
import { CompactTagList } from "@/components/tag-list/compact-tag-list";
import { api } from "@/server/api";
import { ProjectSearchQuery } from "@/app/projects/types";

import { getLatestProjects } from "../backend-search-requests";

enum TimeRange {
  week = "this-week",
  month = "this-month",
  year = "this-year",
}

type PageProps = {
  timeRange: TimeRange;
  searchState: ProjectSearchQuery;
};

const dict = {
  "this-week": "weekly",
  "this-month": "monthly",
  "this-year": "yearly",
};

// Hatem TODO: add generateMetadata function

export default async function IndexPage(props: PageProps) {
  console.log("[time-range]/page.tsx:", props);
  const sortOptionId = dict[props.timeRange] as SortOptionKey;
  const sortOptionLabel = sortOrderOptionsByKey[sortOptionId]?.label;
  return (
    <Card>
      <CardHeader>
        <SectionHeading
          icon={<GoFlame fontSize={32} />}
          title="Hot Projects"
          subtitle={sortOptionLabel}
        />
        <HotProjectSortOrderPicker
          value={sortOptionId}
          searchState={props.searchState}
        />
      </CardHeader>
      {/* <ProjectTable
        projects={projects}
        showDetails={false}
        metricsCell={(project) => (
          <ProjectScore project={project} sortOptionId={sortOptionId} />
        )}
        footer={
          <NextLink
            href={`/projects?sort=daily`}
            passHref
            className={buttonVariants(
              { variant: "link" },
              "text-md w-full text-secondary-foreground"
            )}
          >
            View full rankings »
          </NextLink>
        }
      /> */}
    </Card>
  );
}
