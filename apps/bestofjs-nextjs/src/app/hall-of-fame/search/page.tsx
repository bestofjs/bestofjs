import { db } from "@repo/db";
import { findHallOfFameMembers } from "@repo/db/hall-of-fame";
import { HallOfFamePaginatedList } from "../hall-of-fame-paginated-list";
import { HallOfFameSearchStateParser } from "./hall-of-fame-search-state";
import { HallOfFameSearchBar } from "./search-bar";

const searchStateParser = new HallOfFameSearchStateParser();

type PageProps = {
  searchParams: { query?: string };
};

export default async function HallOfFameSearchPage({
  searchParams,
}: PageProps) {
  const { searchState, buildPageURL } = searchStateParser.parse(searchParams);

  const { members, total } = await findHallOfFameMembers({
    db,
    page: searchState.page,
    limit: searchState.limit,
    searchQuery: searchState.query,
  });

  return (
    <>
      <HallOfFameSearchBar />
      <HallOfFamePaginatedList
        members={members}
        total={total}
        searchState={searchState}
        buildPageURL={buildPageURL}
      />
    </>
  );
}
