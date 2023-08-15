import { Metadata } from "next";

import { PageHeading } from "@/components/core/typography";

import { searchClient } from "../backend";
import { HallOfFameMemberList } from "./hall-of-member-list";
import Loading from "./loading";

const forceLoadingState = false; // set to true when debugging the loading state

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Hall of Fame",
    description:
      "The greatest developers, authors and speakers of the JavaScript community",
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
            Contact us on GitHub to add more members!
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
