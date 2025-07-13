import { InfoIcon } from "lucide-react";

import type { HallOfFameMember } from "@repo/db/hall-of-fame";

import {
  BottomPaginationControls,
  TopPaginationControls,
} from "@/components/core/pagination/pagination-controls";
import { computePaginationState } from "@/components/core/pagination/pagination-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { HallOfFameMemberList } from "./hall-of-fame-member-list";
import type {
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
        <InfoIcon className="size-5" />
        <AlertTitle>No results found</AlertTitle>
        <AlertDescription>
          Try another search or click on the Reset button.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="flex justify-between text-muted-foreground">
        <div>
          {searchState.query ? (
            <DescribeSearchResults count={total} />
          ) : (
            <p>Showing all members, by number of followers on GitHub</p>
          )}
        </div>

        {paginationState.numberOfPages > 1 && (
          <TopPaginationControls
            paginationState={paginationState}
            buildPageURL={buildPageURL}
            className="text-md"
            compact
          />
        )}
      </div>

      <HallOfFameMemberList members={members} />

      {paginationState.numberOfPages > 1 && (
        <div className="flex justify-end">
          <BottomPaginationControls
            paginationState={paginationState}
            buildPageURL={buildPageURL}
          />
        </div>
      )}
    </>
  );
}
