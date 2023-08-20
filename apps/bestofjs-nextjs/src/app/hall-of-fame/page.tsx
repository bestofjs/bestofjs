import { Metadata } from "next";

import { APP_REPO_URL } from "@/config/site";
import { ExternalLink, PageHeading } from "@/components/core/typography";

import { searchClient } from "../backend";
import { HallOfFameMemberList } from "./hall-of-member-list";
import Loading from "./loading";

const forceLoadingState = false; // set to true when debugging the loading state

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Hall of Fame",
    description:
      "Some of the greatest developers, authors and speakers of the JavaScript community. Meet Evan, Dan, Sindre, TJ and friends!",
  };
}

export default async function HallOfFamePage() {
  const { members } = await fetchHallOfFameMembers();
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
      <HallOfFameMemberList members={members} />
    </>
  );
}

function fetchHallOfFameMembers() {
  return searchClient.findHallOfFameMembers();
}
