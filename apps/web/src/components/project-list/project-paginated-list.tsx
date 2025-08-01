import type {
  ProjectSearchState,
  ProjectSearchUrlBuilder,
} from "@/app/projects/project-search-state";
import { Card, CardHeader } from "@/components/ui/card";

import {
  BottomPaginationControls,
  TopPaginationControls,
} from "../core/pagination/pagination-controls";
import { computePaginationState } from "../core/pagination/pagination-state";
import { ProjectSortOrderPicker } from "./project-sort-order-picker";
import { ProjectScore, ProjectTable } from "./project-table";
import type { SortOptionKey } from "./sort-order-options";

type Props = {
  projects: BestOfJS.Project[];
  searchState: ProjectSearchState;
  buildPageURL: ProjectSearchUrlBuilder;
  total: number;
};
export const ProjectPaginatedList = ({
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
              <ProjectSortOrderPicker
                value={sort as SortOptionKey}
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
