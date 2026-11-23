import { markdownMetadata } from "@/server/markdown/metadata";

import { HallOfFamePaginatedList } from "../hall-of-fame-paginated-list";
import { getMembers } from "../page-data";
import { HallOfFameSearchStateParser } from "./hall-of-fame-search-state";
import { HallOfFameSearchBar } from "./search-bar";

const searchStateParser = new HallOfFameSearchStateParser();

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(props: PageProps) {
  const { searchState } = searchStateParser.parse(await props.searchParams);
  const params = new URLSearchParams();
  if (searchState.query) params.set("query", searchState.query);
  if (searchState.page > 1) params.set("page", String(searchState.page));
  if (searchState.limit !== 50) params.set("limit", String(searchState.limit));
  const query = params.toString();
  return markdownMetadata(
    query ? `/hall-of-fame/search?${query}` : "/hall-of-fame/search",
  );
}

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
