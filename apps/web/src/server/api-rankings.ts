import type { ProjectWithTrends } from "@repo/core/services/projects";

import {
  buildTagsByCode,
  toTrendsProject,
} from "@/app/projects/project-adapter";
import { env } from "@/env.mjs";

import { type RankingEntry, resolveRankingProjects } from "./ranking-resolver";

type RankingsData = {
  year: number;
  month: number;
  trending: RankingEntry[];
  isFirst: boolean;
  isLatest: boolean;
};

type RankingTag = Parameters<typeof buildTagsByCode>[0][number];

type RankingsDependencies = {
  findProjectsBySlugs: (options: { slugs: string[] }) => Promise<{
    projects: ProjectWithTrends[];
    missingSlugs: string[];
  }>;
  findTags: () => Promise<readonly RankingTag[]>;
};

export type MonthlyDate = {
  year: number;
  month: number;
};

export function createRankingsAPI({
  findProjectsBySlugs,
  findTags,
}: RankingsDependencies) {
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

      // Resolve the whole archive before applying the limit. A deployment that
      // hides some tags must still render a full page from the remaining rows.
      const entries = data.trending;
      const [{ projects: foundRows, missingSlugs }, allTags] =
        await Promise.all([
          findProjectsBySlugs({ slugs: entries.map((entry) => entry.slug) }),
          findTags(),
        ]);
      const tagsByCode = buildTagsByCode(allTags);
      const foundProjects = foundRows.map((row) =>
        toTrendsProject(row, tagsByCode),
      );
      const { projects, missingEntries } = resolveRankingProjects({
        entries,
        foundProjects,
        limit,
        missingSlugs,
      });

      for (const { slug, full_name } of missingEntries) {
        console.log("Not found", { slug, full_name });
      }

      return {
        isFirst,
        isLatest,
        projects,
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
