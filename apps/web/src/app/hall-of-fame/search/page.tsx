import { HallOfFamePaginatedList } from "../hall-of-fame-paginated-list";
import { getMembers } from "../page-data";
import { HallOfFameSearchStateParser } from "./hall-of-fame-search-state";
import { HallOfFameSearchBar } from "./search-bar";

const searchStateParser = new HallOfFameSearchStateParser();

type PageProps = {
  searchParams: Promise<{ query?: string }>;
};

export default async function HallOfFameSearchPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const { searchState, buildPageURL } = searchStateParser.parse(searchParams);

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
