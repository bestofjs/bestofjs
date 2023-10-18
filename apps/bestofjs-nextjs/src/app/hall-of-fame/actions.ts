"use server";

import { api } from "@/server/api";

export async function searchHallOfFameMembers(query: string) {
  "use server";
  const { members } = await api.hallOfFame.findMembers({ query });
  await sleep(1000);
  return members;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
