import NextLink from "next/link";
import { GoFlame } from "react-icons/go";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { SectionHeading } from "@/components/core/section";
import {
  ProjectPageSearchParams,
  parseSearchParams,
} from "@/components/project-list/navigation-state";
import { HotProjectSortOrderPicker } from "@/components/project-list/project-sort-order-picker";
import {
  ProjectScore,
  ProjectTable,
} from "@/components/project-list/project-table";
import {
  SortOptionKey,
  getSortOptionByKey,
  sortOrderOptionsByKey,
} from "@/components/project-list/sort-order-options";
import { api } from "@/server/api";
import { getHotProjectsRequest } from "@/app/backend-search-requests";
import { ProjectSearchQuery } from "@/app/projects/types";

type Props = {
  projects: BestOfJS.Project[];
  sortOptionId: SortOptionKey;
  searchState: ProjectSearchQuery;
  path?: string;
};

export async function HotProjectList({
  projects,
  sortOptionId,
  searchState,
}: Props) {
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
          searchState={searchState}
        />
      </CardHeader>
      <ProjectTable
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
      />
    </Card>
  );
}

export async function getHotProjects(searchParams: ProjectPageSearchParams) {
  const defaultParams = { sort: "daily" as SortOptionKey };
  const searchState = parseSearchParams(searchParams, defaultParams);
  const sortOption = getSortOptionByKey(searchState.sort);
  const { projects } = await api.projects.findProjects(
    getHotProjectsRequest(5, sortOption.sort)
  );
  return { projects, sortOptionId: sortOption.key, searchState };
}
