import { cacheTag } from "next/cache";

import { findTags } from "@repo/core/services/tags";

export async function getCachedTags() {
  "use cache";
  cacheTag("tags");
  return await findTags();
}
