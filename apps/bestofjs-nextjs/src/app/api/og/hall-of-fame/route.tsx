/* eslint-disable @next/next/no-img-element */
import { api } from "@/server/api-remote-json";

import { ImageLayout } from "../og-image-layout";
import { Box, generateImageResponse } from "../og-utils";

export const runtime = "edge";

export async function GET() {
  const NUMBER_OF_CARD = 16;
  const { members } = await api.hallOfFame.findMembers({
    limit: NUMBER_OF_CARD,
  });

  return generateImageResponse(
    <ImageLayout>
      <Box style={{ fontSize: 64 }}>JavaScript Hall of Fame</Box>
      <Box style={{ flexDirection: "row", gap: 32, flexWrap: "wrap" }}>
        {members.map((member) => (
          <MemberBox key={member.username} member={member} size={112} />
        ))}
      </Box>
    </ImageLayout>
  );
}

function MemberBox({
  member,
  size,
}: {
  member: BestOfJS.HallOfFameMember;
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
