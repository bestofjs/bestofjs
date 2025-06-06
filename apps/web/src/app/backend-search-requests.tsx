import { TAGS_EXCLUDED_FROM_RANKINGS } from "@repo/db/constants";

export function getHotProjectsRequest(count = 5, sortOrder = "daily") {
  return {
    criteria: {
      tags: { $nin: TAGS_EXCLUDED_FROM_RANKINGS },
    },
    sort: {
      [`trends.${sortOrder}`]: -1,
    },
    limit: count,
  };
}

export function getLatestProjects() {
  return {
    sort: {
      added_at: -1,
    },
    limit: 5,
  };
}
