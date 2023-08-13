import { PageHeading } from "@/components/core/typography";

import { searchClient } from "../backend";
import { HallOfFameMemberList } from "./hall-of-member-list";

export default async function HallOfFamePage() {
  const { members } = await fetchHallOfFameMembers();
  return (
    <>
      <PageHeading
        title={<>JavaScript Hall of Fame</>}
        subtitle={
          <>
            Here are some of the greatest developers, authors and speakers of
            the JavaScript community.
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
