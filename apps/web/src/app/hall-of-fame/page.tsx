import { cacheTag } from "next/cache";

import { db } from "@repo/db";
import { findHallOfFameMembers } from "@repo/db/hall-of-fame";

import { HallOfFamePaginatedList } from "./hall-of-fame-paginated-list";
import Loading from "./loading";
import { HallOfFameSearchStateParser } from "./search/hall-of-fame-search-state";
import { HallOfFameSearchBar } from "./search/search-bar";

const forceLoadingState = false; // set to true when debugging the loading state

const searchStateParser = new HallOfFameSearchStateParser();

export default async function HallOfFamePage() {
  "use cache";
  cacheTag("hall-of-fame");
  if (forceLoadingState) return <Loading />;

  const { searchState, buildPageURL } = searchStateParser.parse({});

  const { members, total } = await findHallOfFameMembers({
    db,
    page: 1,
    limit: searchState.limit,
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
