import React from "react";

import { Card } from "@/components/ui/card";

import { CardHeader } from "../core";
import {
  BottomPaginationControls,
  TopPaginationControls,
} from "../core/pagination/pagination-controls";
import { computePaginationState } from "../core/pagination/pagination-state";
import { ProjectSortOrderPicker } from "./project-sort-order-picker";
import { ProjectScore, ProjectTable } from "./project-table";
import { SortOptionKey } from "./sort-order-options";

type Props = {
  projects: BestOfJS.Project[];
  page: number;
  total: number;
  limit: number;
  sortOptionId: string;
  searchState: any;
  buildPageURL: any;
  path?: string;
};
export const ProjectPaginatedList = ({
  projects,
  page,
  total,
  limit,
  sortOptionId,
  buildPageURL,
  searchState,
  path,
}: Props) => {
  const showPagination = total > limit;
  const showSortOptions = total > 1;
  const paginationState = computePaginationState({
    total,
    currentPageNumber: page,
    limit,
  });

  if (total === 0) {
    return (
      <Card className="flex items-center justify-center py-8">
        No projects found
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        {(showSortOptions || showPagination) && (
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            {showSortOptions && (
              <ProjectSortOrderPicker
                value={sortOptionId as SortOptionKey}
                searchState={searchState}
                path={path}
              />
            )}
            {showPagination && (
              <TopPaginationControls
                paginationState={paginationState}
                buildPageURL={buildPageURL}
              />
            )}
          </div>
        )}
      </CardHeader>
      <ProjectTable
        projects={projects}
        buildPageURL={buildPageURL}
        metricsCell={(project) => (
          <ProjectScore project={project} sortOptionId={sortOptionId} />
        )}
        footer={
          <div className="flex justify-end">
            <BottomPaginationControls
              paginationState={paginationState}
              buildPageURL={buildPageURL}
            />
          </div>
        }
      />
    </Card>
  );
};
