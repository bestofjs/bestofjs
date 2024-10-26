import { InfoIcon } from "lucide-react";

import { HallOfFameMember } from "@repo/db/hall-of-fame";
import {
  BottomPaginationControls,
  TopPaginationControls,
} from "@/components/core/pagination/pagination-controls";
import { computePaginationState } from "@/components/core/pagination/pagination-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HallOfFameMemberList } from "./hall-of-fame-member-list";
import {
  HallOfFameSearchState,
  HallOfFameSearchUrlBuilder,
} from "./search/hall-of-fame-search-state";
import { DescribeSearchResults } from "./search/search-bar";

type Props = {
  members: HallOfFameMember[];
  total: number;
  searchState: HallOfFameSearchState;
  buildPageURL: HallOfFameSearchUrlBuilder;
};
export function HallOfFamePaginatedList({
  members,
  total,
  searchState,
  buildPageURL,
}: Props) {
  const { page, limit } = searchState;
  const paginationState = computePaginationState({ page, limit, total });

  if (total === 0) {
    return (
      <Alert className="mt-8">
        <InfoIcon className="h-5 w-5" />
        <AlertTitle>No results found</AlertTitle>
        <AlertDescription>
          Try another search or click on the Reset button.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="flex justify-between">
        <div>
          {searchState.query ? (
            <DescribeSearchResults count={total} />
          ) : (
            <p>Showing all {total} members</p>
          )}
        </div>
        <TopPaginationControls
          paginationState={paginationState}
          buildPageURL={buildPageURL}
          className="text-md"
          compact
        />
      </div>
      <HallOfFameMemberList members={members} />
      <div className="flex justify-end">
        <BottomPaginationControls
          paginationState={paginationState}
          buildPageURL={buildPageURL}
        />
      </div>
    </>
  );
}
