import { orderBy, round, uniqBy } from "es-toolkit";
import { z } from "zod";

import { schema } from "@repo/db";
import { notInArray } from "@repo/db/drizzle";
import {
  flattenSnapshots,
  isProjectIncludedInRankings,
} from "@repo/db/projects";
import { getMonthlyDelta } from "@repo/db/snapshots";
import { truncate } from "@/shared/utils";
import { createTask } from "@/task-runner";

export const buildMonthlyRankingsTask = createTask({
  name: "build-monthly-rankings",
  description: "Build monthly rankings to be displayed on the frontend",
  flags: {
    year: {
      type: Number,
      description: "Year to build rankings for",
    },
    month: {
      type: Number,
      description: "Month to build rankings for",
    },
  },
  schema: z.object({ year: z.number(), month: z.number() }),

  async run(context, flags) {
    const { logger, processRepos, saveJSON } = context;
    const { year, month } = flags;

    const results = await processRepos(
      async (repo) => {
        const project = repo.projects?.[0];
        if (!project) throw new Error("No project found");

        if (!repo.snapshots?.length)
          return { data: null, meta: { "no snapshots": true } };

        const flattenedSnapshots = flattenSnapshots(repo.snapshots);
        const { delta, stars } = getMonthlyDelta(flattenedSnapshots, {
          year,
          month,
        });

        if (delta === undefined || stars === undefined) {
          return { data: null, meta: { "not enough snapshots": true } };
        }
        if (!isProjectIncludedInRankings(project)) {
          return { data: null, meta: { excluded: true } };
        }

        const relativeGrowth = delta ? delta / (stars - delta) : undefined;
        const description =
          project.overrideDescription || !repo.description
            ? project.description
            : repo.description;

        const data = {
          name: project.name,
          full_name: repo.full_name,
          description: truncate(description, 75),
          stars: stars || 0,
          delta,
          relativeGrowth:
            relativeGrowth !== undefined ? round(relativeGrowth, 4) : null,
          tags: project.tags.map((tag) => tag.code),
          owner_id: repo.owner_id,
          created_at: repo.created_at,
        };
        return { data, meta: { success: true } };
      },
      { where: notInArray(schema.projects.status, ["deprecated", "hidden"]) }
    );

    const projects = uniqBy(
      results.data.filter((project) => project !== null),
      (project) => project.full_name
    );

    const trending = orderBy(projects, ["delta"], ["desc"]).slice(0, 100);

    const byRelativeGrowth = orderBy(
      projects,
      ["relativeGrowth"],
      ["desc"]
    ).slice(0, 100);

    const output = {
      year,
      month,
      isFirst: false,
      isLatest: true,
      trending,
      byRelativeGrowth,
    };

    logger.info("Rankings summary", {
      trending: trending
        .slice(0, 5)
        .map((project) => `${project.name} (+${project.delta})`),
      relative: byRelativeGrowth
        .slice(0, 5)
        .map((project) => `${project.name} (${project.relativeGrowth})`),
    });
    await saveJSON(output, `monthly/${year}/${formatDate(year, month)}.json`);

    return results;
  },
});

function formatDate(year: number, month: number) {
  return `${year}-${month.toString().padStart(2, "0")}`;
}
