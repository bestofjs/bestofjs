import { cacheTag } from "next/cache";

import { HallOfFamePaginatedList } from "./hall-of-fame-paginated-list";
import Loading from "./loading";
import { getMembers } from "./page-data";
import { HallOfFameSearchStateParser } from "./search/hall-of-fame-search-state";
import { HallOfFameSearchBar } from "./search/search-bar";

const forceLoadingState = false; // set to true when debugging the loading state

const searchStateParser = new HallOfFameSearchStateParser();

export default async function HallOfFamePage() {
  "use cache";
  cacheTag("hall-of-fame");
  if (forceLoadingState) return <Loading />;

  const { searchState, buildPageURL } = searchStateParser.parse({});

  const { members, total } = await getMembers(searchState);

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
