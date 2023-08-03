import { SearchQueryUpdater } from "@/app/projects/types";
import { TagSearchQuery } from "@/app/tags/tag-list-shared";

import { CardHeader } from "../core";
import {
  BottomPaginationControls,
  TopPaginationControls,
} from "../core/pagination/pagination-controls";
import { computePaginationState } from "../core/pagination/pagination-state";
import { Card } from "../ui/card";
import { TagList } from "./tag-list";
import { TagSortOrderPicker } from "./tag-sort-order-picker.client";

type Props = {
  tags: BestOfJS.TagWithProjects[];
  page: number;
  total: number;
  limit: number;
  sortOptionId: string;
  buildTagsPageURL: (updater: SearchQueryUpdater<TagSearchQuery>) => string;
  searchState: TagSearchQuery;
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
        <div className="flex flex-col justify-between gap-4 md:flex-row">
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
