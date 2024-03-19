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
} from "@/components/project-list/sort-order-options";
import { api } from "@/server/api";
import { getHotProjectsRequest } from "@/app/backend-search-requests";
import { ProjectSearchQuery } from "@/app/projects/types";

type Props = {
  projects: BestOfJS.Project[];
  sortOptionId: string;
  searchState: ProjectSearchQuery;
  path?: string;
};

export async function HotProjectList({
  projects,
  sortOptionId,
  searchState,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <SectionHeading
          icon={<GoFlame fontSize={32} />}
          title="Hot Projects"
          subtitle={
            <>
              By number of stars added <b>the last 24 hours</b>
            </>
          }
        />
        <HotProjectSortOrderPicker
          value={sortOptionId as SortOptionKey}
          searchState={searchState}
        />
      </CardHeader>
      <ProjectTable
        projects={projects}
        showDetails={false}
        metricsCell={(project) => (
          <ProjectScore project={project} sortOptionId="daily" />
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
