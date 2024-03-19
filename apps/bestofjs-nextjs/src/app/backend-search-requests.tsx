import { Sort } from "@/components/project-list/sort-order-options";

export function getHotProjectsRequest(
  count = 5,
  sort: Sort = { "trends.daily": -1 }
) {
  return {
    criteria: {
      tags: { $nin: ["meta", "learning"] },
    },
    sort,
    limit: count,
  };
}

export function getLatestProjects() {
  return {
    sort: {}, // TODO sort by `addedAt` when it's available in data instead of relying on the default sort
    limit: 5,
  };
}
