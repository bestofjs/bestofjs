import {
  TagSearchState,
  TagSearchUrlBuilder,
} from "@/app/tags/tag-search-state";
import {
  BottomPaginationControls,
  TopPaginationControls,
} from "@/components/core/pagination/pagination-controls";
import { computePaginationState } from "@/components/core/pagination/pagination-state";
import { Card, CardHeader } from "@/components/ui/card";
import { TagList } from "./tag-list";
import { TagSortOrderPicker } from "./tag-sort-order-picker";

type Props = {
  tags: BestOfJS.TagWithProjects[];
  total: number;
  buildPageURL: TagSearchUrlBuilder;
  searchState: TagSearchState;
};

export const TagPaginatedList = ({
  searchState,
  buildPageURL,
  tags,
  total,
}: Props) => {
  const { page, limit } = searchState;
  const showPagination = total > limit;
  const paginationState = computePaginationState({ page, limit, total });

  return (
    <Card>
      <CardHeader>
        <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
          <TagSortOrderPicker
            value={searchState.sort}
            buildPageURL={buildPageURL}
          />
          {showPagination && (
            <TopPaginationControls
              paginationState={paginationState}
              buildPageURL={buildPageURL}
            />
          )}
        </div>
      </CardHeader>
      <TagList tags={tags} />
      <div className="flex justify-end border-t p-4">
        <BottomPaginationControls
          paginationState={paginationState}
          buildPageURL={buildPageURL}
        />
      </div>
    </Card>
  );
};
