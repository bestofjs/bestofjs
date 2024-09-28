import {
  TagSearchState,
  TagSearchUrlBuilder,
} from "@/app/tags/tag-search-types";
import {
  BottomPaginationControls,
  TopPaginationControls,
} from "@/components/core/pagination/pagination-controls";
import { computePaginationState } from "@/components/core/pagination/pagination-state";
import { Card, CardHeader } from "@/components/ui/card";
import { TagList } from "./tag-list";
import { TagSortOrderPicker } from "./tag-sort-order-picker.client";

type Props = {
  tags: BestOfJS.TagWithProjects[];
  page: number;
  total: number;
  limit: number;
  sortOptionId: string;
  buildTagsPageURL: TagSearchUrlBuilder;
  searchState: TagSearchState;
};

export const TagPaginatedList = ({
  searchState,
  buildTagsPageURL,
  tags,
  page,
  total,
  limit,
}: Props) => {
  const showPagination = total > limit;
  const paginationState = computePaginationState({
    total,
    currentPageNumber: page,
    limit,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
          <TagSortOrderPicker
            value={searchState.sortOptionId}
            searchState={searchState}
          />
          {showPagination && (
            <TopPaginationControls
              paginationState={paginationState}
              buildPageURL={buildTagsPageURL}
            />
          )}
        </div>
      </CardHeader>
      <TagList tags={tags} />
      <div className="flex justify-end border-t p-4">
        <BottomPaginationControls
          paginationState={paginationState}
          buildPageURL={buildTagsPageURL}
        />
      </div>
    </Card>
  );
};
