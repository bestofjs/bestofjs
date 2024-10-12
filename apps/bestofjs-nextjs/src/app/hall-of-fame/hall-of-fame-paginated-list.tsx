import { HallOfFameMember } from "@repo/db/hall-of-fame";
import { BottomPaginationControls } from "@/components/core/pagination/pagination-controls";
import { computePaginationState } from "@/components/core/pagination/pagination-state";
import { HallOfFameMemberList } from "./hall-of-fame-member-list";
import {
  HallOfFameSearchState,
  HallOfFameSearchUrlBuilder,
} from "./hall-of-fame-search-state";

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

  return (
    <>
      <HallOfFameMemberList members={members} />
      <BottomPaginationControls
        paginationState={paginationState}
        buildPageURL={buildPageURL}
      />
    </>
  );
}
