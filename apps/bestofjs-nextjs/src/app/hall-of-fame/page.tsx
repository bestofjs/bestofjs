import { Metadata } from "next";

import { APP_REPO_URL } from "@/config/site";
import { ExternalLink, PageHeading } from "@/components/core/typography";
import { api } from "@/server/api";

import { HallOfFameClientView } from "./hall-of-fame-view.client";
import { HallOfFameMemberList } from "./hall-of-member-list";
import Loading from "./loading";

const forceLoadingState = false; // set to true when debugging the loading state

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Hall of Fame",
    description:
      "Some of the greatest developers, authors and speakers of the JavaScript community. Meet Evan, Dan, Sindre, TJ and friends!",
    openGraph: {
      images: [`/api/og/hall-of-fame`],
    },
  };
}

export default async function HallOfFamePage() {
  const { members: allMembers } = await api.hallOfFame.findMembers();
  if (forceLoadingState) return <Loading />;

  return (
    <>
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
      <HallOfFameClientView
        initialContent={
          <>
            <div className="mb-4 text-muted-foreground">
              Showing <b>all</b> {allMembers.length} members by number of
              followers
            </div>
            <HallOfFameMemberList members={allMembers} />
          </>
        }
      />
    </>
  );
}
