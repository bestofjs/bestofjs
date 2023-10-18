"use server";

import { api } from "@/server/api";

export async function searchHallOfFameMembers(query: string) {
  "use server";
  const { members } = await api.hallOfFame.findMembers({ query });
  return members;
}

// an attempt to use FormData with `<form action={}>`
// export async function searchHallOfFameMembers2(formData: FormData) {
//   "use server";
//   const query = formData.get("query") || "";
//   console.log("searchMembers!!", query);
//   const { members } = await api.hallOfFame.findMembers({ query });
//   await sleep(1000);
//   return members;
// }

// function sleep(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }
