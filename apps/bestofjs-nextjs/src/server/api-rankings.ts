import { env } from "@/env.mjs";

import { createProjectsAPI } from "./api-projects";

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
  projectsAPI: ReturnType<typeof createProjectsAPI>
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
        res.json()
      )) as RankingsData;
      const { isFirst, isLatest, month, year } = data;
      const projects = data.trending.slice(0, limit);
      const fullNames = projects.map((project) => project.full_name);

      const { projects: foundProjects } = await projectsAPI.findProjects({
        criteria: { full_name: { $in: fullNames } },
        limit,
      });

      const sortedProjects = projects
        .map(({ full_name, delta }) => {
          const project = foundProjects.find(
            (project) => project.full_name === full_name
          );
          if (!project) {
            console.log("Not found", full_name);

            return;
          }
          return { ...project, score: delta };
        })
        .filter(Boolean);
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
