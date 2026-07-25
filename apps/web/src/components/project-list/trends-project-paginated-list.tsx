import type {
  TrendsProjectSearchState,
  TrendsProjectSearchUrlBuilder,
} from "@/app/projects/trends-project-search-state";
import { Card, CardHeader } from "@/components/ui/card";

import {
  BottomPaginationControls,
  TopPaginationControls,
} from "../core/pagination/pagination-controls";
import { computePaginationState } from "../core/pagination/pagination-state";
import { ProjectScore, ProjectTable } from "./project-table";
import { TrendsProjectSortOrderPicker } from "./trends-sort-order-picker";

type Props = {
  projects: BestOfJS.Project[];
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
      <CardHeader>
        {(showSortOptions || showPagination) && (
          <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
            {showSortOptions && (
              <TrendsProjectSortOrderPicker
                value={sort}
                buildPageURL={buildPageURL}
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
          <ProjectScore project={project} sort={sort} />
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
