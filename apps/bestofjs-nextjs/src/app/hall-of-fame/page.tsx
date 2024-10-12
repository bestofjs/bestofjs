import { Metadata } from "next";

import { getDatabase } from "@repo/db";
import { findHallOfFameMembers } from "@repo/db/hall-of-fame";
import { ExternalLink, PageHeading } from "@/components/core/typography";
import {
  APP_CANONICAL_URL,
  APP_DISPLAY_NAME,
  APP_REPO_URL,
} from "@/config/site";
import { HallOfFamePaginatedList } from "./hall-of-fame-paginated-list";
import { HallOfFameSearchStateParser } from "./hall-of-fame-search-state";
import Loading from "./loading";
import { HallOfFameSearchBar } from "./search-bar";

const forceLoadingState = false; // set to true when debugging the loading state

const description =
  "Some of the greatest developers, authors and speakers of the JavaScript community. Meet Evan, Dan, Sindre, TJ and friends!";

const searchStateParser = new HallOfFameSearchStateParser();

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

type PageProps = {
  searchParams: { query?: string };
};

export default async function HallOfFamePage({ searchParams }: PageProps) {
  if (forceLoadingState) return <Loading />;

  const db = await getDatabase();

  const { searchState, buildPageURL } = searchStateParser.parse(searchParams);

  const { members, total } = await findHallOfFameMembers({
    db,
    page: searchState.page,
    limit: searchState.limit,
    searchQuery: searchState.query,
  });

  return (
    <div className="space-y-6">
      <PageHeading
        title={<>JavaScript Hall of Fame</>}
        subtitle={
          <>
            Here are some of the greatest developers, authors and speakers of
            the JavaScript community.
            <br />
            They are sorted by number of followers,{" "}
            <ExternalLink
              url={APP_REPO_URL}
              className="color-primary underline hover:no-underline"
            >
              contact us
            </ExternalLink>{" "}
            to add more members!
          </>
        }
      />
      <HallOfFameSearchBar />
      <HallOfFamePaginatedList
        members={members}
        total={total}
        searchState={searchState}
        buildPageURL={buildPageURL}
      />
    </div>
  );
}
