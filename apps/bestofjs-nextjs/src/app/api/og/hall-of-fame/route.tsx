/* eslint-disable @next/next/no-img-element */
import { getDatabase } from "@repo/db";
import { findHallOfFameMembers, HallOfFameMember } from "@repo/db/hall-of-fame";
import { ImageLayout } from "../og-image-layout";
import { Box, generateImageResponse } from "../og-utils";

export const runtime = "edge";

const NUMBER_OF_CARD = 16;

export async function GET() {
  const db = await getDatabase();
  const { members } = await findHallOfFameMembers({
    db,
    limit: NUMBER_OF_CARD,
    page: 1,
  });

  return generateImageResponse(
    <ImageLayout>
      <Box style={{ flexDirection: "column", gap: 48 }}>
        <Box style={{ fontSize: 64 }}>JavaScript Hall of Fame</Box>
        <Box style={{ flexDirection: "row", gap: 32, flexWrap: "wrap" }}>
          {members.map((member) => (
            <MemberBox key={member.username} member={member} size={110} />
          ))}
        </Box>
      </Box>
    </ImageLayout>
  );
}

function MemberBox({
  member,
  size,
}: {
  member: HallOfFameMember;
  size: number;
}) {
  return (
    <Box>
      <img
        src={`${member.avatar}&s=${size}`}
        width={size}
        height={size}
        alt={member.username}
      />
    </Box>
  );
}
