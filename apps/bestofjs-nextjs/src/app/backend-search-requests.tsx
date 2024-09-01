import { TAGS_EXCLUDED_FROM_RANKINGS } from "@repo/db/constants";

export function getHotProjectsRequest(count = 5) {
  return {
    criteria: {
      tags: { $nin: TAGS_EXCLUDED_FROM_RANKINGS },
    },
    sort: {
      "trends.daily": -1,
    },
    limit: count,
  };
}

export function getLatestProjects() {
  return {
    sort: {}, // TODO sort by `addedAt` when it's available in data instead of relying on the default sort
    limit: 5,
  };
}
