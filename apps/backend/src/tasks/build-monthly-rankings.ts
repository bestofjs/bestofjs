import { orderBy, round, uniqBy } from "es-toolkit";
import { z } from "zod";

import {
  flattenSnapshots,
  getProjectDescription,
  isProjectIncludedInRankings,
  ProjectDetails,
} from "@repo/db/projects";
import { getMonthlyDelta } from "@repo/db/snapshots";
import { Task } from "@/task-runner";
import { truncate } from "@/utils";

const schema = z.object({ year: z.number(), month: z.number() });

export const buildMonthlyRankingsTask: Task<z.infer<typeof schema>> = {
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
  schema,

  async run(context, flags) {
    const { logger, processProjects, saveJSON } = context;
    const { year, month } = flags;

    const results = await processProjects(async (project) => {
      const repo = project.repo;

      if (!repo) throw new Error("No repo found");
      if (!shouldProcessProject(project))
        return { data: null, meta: { skipped: true } };
      if (!repo.snapshots?.length)
        return { data: null, meta: { "no snapshots": true } };

      const flattenedSnapshots = flattenSnapshots(repo.snapshots);
      const { delta, stars } = getMonthlyDelta(flattenedSnapshots, {
        year,
        month,
      });

      if (delta === undefined) {
        return { data: null, meta: { "not enough snapshots": true } };
      }
      if (!isProjectIncludedInRankings(project)) {
        return { data: null, meta: { excluded: true } };
      }

      const relativeGrowth = delta ? delta / (stars - delta) : undefined;

      const data = {
        name: project.name,
        full_name: repo.full_name,
        description: truncate(getProjectDescription(project), 75),
        stars,
        delta,
        relativeGrowth:
          relativeGrowth !== undefined ? round(relativeGrowth, 4) : null,
        tags: project.tags.map((tag) => tag.code),
        owner_id: repo.owner_id,
        created_at: repo.created_at,
      };
      return { data, meta: { success: true } };
    });

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
};

function formatDate(year: number, month: number) {
  return `${year}-${month.toString().padStart(2, "0")}`;
}

function shouldProcessProject(project: ProjectDetails) {
  return !["deprecated", "hidden"].includes(project.status);
}
