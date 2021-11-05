import React from "react";
import { useHistory, useLocation } from "react-router-dom";

import {
  ProjectScore,
  ProjectTable,
} from "components/project-list/project-table";
import { PaginationContainer } from "components/core/pagination/provider";
import {
  TopPaginationControls,
  BottomPaginationControls,
} from "components/core/pagination/pagination-controls";
import { Box, Stack } from "components/core";
import { SortOrderPicker } from "./sort-order-picker";
import { updateLocation } from "./search-utils";

export const ProjectPaginatedList = ({
  projects,
  page,
  total,
  limit,
  sortOption,
}) => {
  const { pageNumbers } = PaginationContainer.useContainer();
  const location = useLocation();
  const history = useHistory();

  const onChangeSortOption = (sortId) => {
    const changes = { sort: sortId, page: 1 };
    const nextLocation = updateLocation(location, changes);

    history.push(nextLocation);
  };

  const showPagination = pageNumbers.length > 1;
  const showSortOptions = total > 1;

  return (
    <div>
      {(showSortOptions || showPagination) && (
        <Stack
          direction={{ base: "column", md: "row" }}
          mb={4}
          justifyContent="space-between"
        >
          <Box>
            {showSortOptions && (
              <SortOrderPicker
                onChange={onChangeSortOption}
                value={sortOption.id}
              />
            )}
          </Box>
          {showPagination && (
            <Box>
              <TopPaginationControls history={history} location={location} />
            </Box>
          )}
        </Stack>
      )}
      <ProjectTable
        projects={projects}
        metricsCell={(project) => (
          <ProjectScore project={project} sortOptionId={sortOption.id} />
        )}
      />
      {showPagination && (
        <BottomPaginationControls history={history} location={location} />
      )}
    </div>
  );
};
