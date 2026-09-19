import { findProjectsBySlugs, findTags } from "@/app/db";

import { createRankingsAPI } from "./api-rankings";

export const api = {
  rankings: createRankingsAPI({ findProjectsBySlugs, findTags }),
};
