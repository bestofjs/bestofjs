import { Metadata } from "next";

import { getDatabase } from "@repo/db";
import { findHallOfFameMembers } from "@repo/db/hall-of-fame";
import { ExternalLink, PageHeading } from "@/components/core/typography";
import {
  APP_CANONICAL_URL,
  APP_DISPLAY_NAME,
  APP_REPO_URL,
} from "@/config/site";
import { HallOfFameMemberList } from "./hall-of-fame-member-list";
import Loading from "./loading";
import { DescribeSearchResults, HallOfFameSearchBar } from "./search-bar";

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

type PageProps = {
  searchParams: { query?: string };
};

export default async function HallOfFamePage({
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  if (forceLoadingState) return <Loading />;

  const db = await getDatabase();
  const searchQuery = searchParams.q;
  const { members, total } = await findHallOfFameMembers({
    db,
    limit: 50,
    offset: 0,
    searchQuery,
  });

  return (
    <div className="space-y-4">
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
      <HallOfFameSearchBar query={searchQuery} />
      {searchQuery ? (
        <DescribeSearchResults count={members.length} />
      ) : (
        <p>Showing all {total} members by number of followers</p>
      )}
      <HallOfFameMemberList members={members} />
    </div>
  );
}
