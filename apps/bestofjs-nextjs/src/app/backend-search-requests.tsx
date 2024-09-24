import { TAGS_EXCLUDED_FROM_RANKINGS } from "@repo/db/constants";
import { Sort } from "@/components/project-list/sort-order-options";

export function getHotProjectsRequest(
  count = 5,
  sort: Sort = { "trends.daily": -1 }
) {
  return {
    criteria: {
      tags: { $nin: TAGS_EXCLUDED_FROM_RANKINGS },
    },
    sort,
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
