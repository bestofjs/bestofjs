export function getHotProjectsRequest(count = 5) {
  return {
    criteria: {
      tags: { $nin: ["meta", "learning"] },
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

export function getBestOfJSProject() {
  return {
    criteria: {
      full_name: "bestof/bestofjs-webui",
    },
    limit: 1,
  };
}
