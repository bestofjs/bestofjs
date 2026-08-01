import { getProjectLabel } from "@repo/db/project-trends";

import type { TrendsProject } from "@/app/projects/project-adapter";
import type {
  TrendsProjectSearchState,
  TrendsProjectSearchUrlBuilder,
} from "@/app/projects/trends-project-search-state";
import { ProjectLabel } from "@/components/core";
import { Card, CardHeader } from "@/components/ui/card";

import {
  BottomPaginationControls,
  TopPaginationControls,
} from "../core/pagination/pagination-controls";
import { computePaginationState } from "../core/pagination/pagination-state";
import { ProjectScore, ProjectTable } from "./project-table";
import { TrendsProjectSortOrderPicker } from "./trends-sort-order-picker";

type Props = {
  projects: TrendsProject[];
  searchState: TrendsProjectSearchState;
  buildPageURL: TrendsProjectSearchUrlBuilder;
  total: number;
};
export const TrendsProjectPaginatedList = ({
  projects,
  buildPageURL,
  searchState,
  total,
}: Props) => {
  const { page, limit, sort } = searchState;
  const showPagination = total > limit;
  const showSortOptions = total > 1;
  const paginationState = computePaginationState({ page, limit, total });

  if (total === 0) {
    return (
      <Card className="flex items-center justify-center py-8">
        No projects found
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:items-center">
          {/* Kept as a wrapper even with a single child: when `showSortOptions`
              is false it holds the left column open so the pagination info
              stays right-aligned. */}
          <div className="flex flex-wrap items-center gap-3">
            {showSortOptions && (
              <TrendsProjectSortOrderPicker
                value={sort}
                buildPageURL={buildPageURL}
              />
            )}
          </div>
          {showPagination && (
            <TopPaginationControls
              paginationState={paginationState}
              buildPageURL={buildPageURL}
            />
          )}
        </div>
      </CardHeader>
      <ProjectTable
        projects={projects}
        buildPageURL={buildPageURL}
        metricsCell={(project) => (
          <ProjectScore project={project} sort={sort} />
        )}
        labels={(project) => (
          <ProjectLabel
            label={getProjectLabel({
              status: project.status,
              activityScore: project.activityScore,
              yearlyStars: project.trends.yearly,
            })}
          />
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
