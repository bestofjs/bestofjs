import styled from "@emotion/styled";
import {
  BottomPaginationControls,
  TopPaginationControls,
} from "components/core/pagination/pagination-controls";
import { PaginationContainer } from "components/core/pagination/provider";
import { useNextLocation } from "components/search";

import { DetailedTagList } from "./tag-list";
import { TagListSortOrderPicker } from "./tag-list-sort-order";

export const PaginatedTagList = ({ tags, total, sortOptionId }) => {
  const { pageNumbers } = PaginationContainer.useContainer();
  const { navigate } = useNextLocation();

  const showPagination = pageNumbers.length > 1;
  const showSortOptions = total > 1;

  return (
    <div>
      {(showSortOptions || showPagination) && (
        <Row>
          <Cell>
            {showSortOptions && (
              <TagListSortOrderPicker
                onChange={(sortId) => navigate({ sort: sortId, page: 1 })}
                value={sortOptionId}
              />
            )}
          </Cell>
          {showPagination && (
            <Cell>
              <TopPaginationControls />
            </Cell>
          )}
        </Row>
      )}
      <DetailedTagList tags={tags} />
      {showPagination && <BottomPaginationControls />}
    </div>
  );
};

const Row = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  @media (min-width: 600px) {
    align-items: center;
    flex-direction: row;
  }
`;
const Cell = styled.div`
  flex: 0 0 50%;
  @media (min-width: 600px) {
    > div:last-child {
      justify-content: flex-end;
    }
  }
`;
