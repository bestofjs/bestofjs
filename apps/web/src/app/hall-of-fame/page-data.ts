import { cacheTag } from "next/cache";

import { db } from "@repo/core";
import { findHallOfFameMembers } from "@repo/core/services/hall-of-fame";

import type { HallOfFameSearchState } from "./search/hall-of-fame-search-state";
export async function getMembers(searchState: HallOfFameSearchState) {
  "use cache";
  cacheTag("hall-of-fame");
  return findHallOfFameMembers({
    db,
    page: searchState.page,
    limit: searchState.limit,
    searchQuery: searchState.query,
  });
}
