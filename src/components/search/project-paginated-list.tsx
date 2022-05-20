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
import { useNextLocation } from "./search-utils";

export const ProjectPaginatedList = ({
  projects,
  page,
  total,
  limit,
  sortOptionId,
}) => {
  const { pageNumbers } = PaginationContainer.useContainer();
  const { navigate } = useNextLocation();

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
                onChange={(sortId) =>
                  navigate({ sort: sortId, page: 1, direction: undefined })
                }
                value={sortOptionId}
              />
            )}
          </Box>
          {showPagination && (
            <Box>
              <TopPaginationControls />
            </Box>
          )}
        </Stack>
      )}
      <ProjectTable
        projects={projects}
        metricsCell={(project) => (
          <ProjectScore project={project} sortOptionId={sortOptionId} />
        )}
      />
      {showPagination && <BottomPaginationControls />}
    </div>
  );
};
