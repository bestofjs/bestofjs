import { env } from "@/env.mjs";

import type { createProjectsAPI } from "./api-projects";

type RankingsData = {
  year: number;
  month: number;
  trending: BestOfJS.ProjectWithScore[];
  isFirst: boolean;
  isLatest: boolean;
};

export type MonthlyDate = {
  year: number;
  month: number;
};

export function createRankingsAPI(
  projectsAPI: ReturnType<typeof createProjectsAPI>,
  /**
   * Whether this deployment hides some tags — only used to keep the
   * "project not found" log meaningful. The filtering itself happens once, in
   * `createAPI()`'s `getData()`.
   */
  hasExcludedTags = false,
) {
  return {
    async getMonthlyRankings({
      date,
      limit,
    }: {
      date?: MonthlyDate;
      limit: number;
    }) {
      const rootURL = env.RANKINGS_ROOT_URL;
      const key = date ? formatDateForFilename(date) : `latest`;
      const url = `${rootURL}/monthly/${key}`;
      const options = {
        next: {
          tags: ["monthly", key], // to be able to revalidate via API calls, on-demand
        },
      };
      const data = (await fetch(url, options).then((res) =>
        res.json(),
      )) as RankingsData;
      const { isFirst, isLatest, month, year } = data;
      // The whole archived ranking is resolved before `limit` is applied, so a
      // deployment that hides some tags still renders a *full* page rather than
      // a truncated one: the lookup below drops the hidden projects, and the
      // slice then takes the top `limit` of what is left. The archive holds ~100
      // entries and the collection is already in memory, so this costs nothing.
      const entries = data.trending;
      const fullNames = entries.map((project) => project.full_name);

      const { projects: foundProjects } = await projectsAPI.findProjects({
        criteria: { full_name: { $in: fullNames } },
        limit: entries.length,
      });

      const sortedProjects = entries
        .map(({ full_name, delta }) => {
          // we use `findLast` to lookup data because the oldest projects have a higher priority. TODO don't lookup by full_name, use a unique key
          const project = foundProjects.findLast(
            (project) => project.full_name === full_name,
          );
          if (!project) {
            // Expected, not an anomaly, on a deployment that hides tags: the
            // archived entry was resolved against a filtered collection.
            if (!hasExcludedTags) console.log("Not found", full_name);

            return;
          }
          return { ...project, score: delta };
        })
        .filter(Boolean)
        .slice(0, limit);
      return {
        isFirst,
        isLatest,
        projects: sortedProjects as BestOfJS.ProjectWithScore[],
        month,
        year,
      };
    },
  };
}

function formatDateForFilename(date: MonthlyDate) {
  const year = date.year.toString();
  const month = date.month.toString().padStart(2, "0");
  return year + "/" + year + "-" + month + ".json";
}
