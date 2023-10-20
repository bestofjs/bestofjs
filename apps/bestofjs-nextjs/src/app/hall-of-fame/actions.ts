"use server";

import { api } from "@/server/api";

export async function searchHallOfFameMembers(query: string) {
  "use server";
  const { members } = await api.hallOfFame.findMembers({ query });
  return members;
}
