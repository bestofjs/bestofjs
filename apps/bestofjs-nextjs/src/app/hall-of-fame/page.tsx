import { Metadata } from "next";

import { db } from "@repo/db";
import { findHallOfFameMembers } from "@repo/db/hall-of-fame";
import { APP_CANONICAL_URL, APP_DISPLAY_NAME } from "@/config/site";
import { HallOfFamePaginatedList } from "./hall-of-fame-paginated-list";
import Loading from "./loading";
import { HallOfFameSearchStateParser } from "./search/hall-of-fame-search-state";
import { HallOfFameSearchBar } from "./search/search-bar";

const forceLoadingState = false; // set to true when debugging the loading state

const description =
  "Some of the greatest developers, authors and speakers of the JavaScript community. Meet Evan, Dan, Sindre, TJ and friends!";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Hall of Fame",
    description,
    openGraph: {
      images: [`/api/og/hall-of-fame`],
      url: APP_CANONICAL_URL + "/hall-of-fame",
      title: APP_DISPLAY_NAME,
      description,
    },
  };
}

const searchStateParser = new HallOfFameSearchStateParser();

export default async function HallOfFamePage() {
  if (forceLoadingState) return <Loading />;

  const { searchState, buildPageURL } = searchStateParser.parse({});

  const { members, total } = await findHallOfFameMembers({
    db,
    page: 1,
    limit: 50,
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
