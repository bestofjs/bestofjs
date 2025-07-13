import { orderBy } from "es-toolkit";

import { schema } from "@repo/db";
import { notInArray } from "@repo/db/drizzle";
import {
  getPackageData,
  getProjectDescription,
  getProjectTrends,
  getProjectURL,
  type ProjectDetails,
} from "@repo/db/projects";

import { truncate } from "@/shared/utils";
import { createTask } from "@/task-runner";

import type { ProjectItem } from "./static-api-types";

// Thresholds for filtering projects included in the main list
const YEARLY_STARS_THRESHOLD = 50;
const MONTHLY_DOWNLOADS_THRESHOLD = 100_000;

export const buildStaticApiTask = createTask({
  name: "build-static-api",
  description:
    "Build a static API from the database, to be used by the frontend app.",

  run: async ({ db, logger, processProjects, saveJSON }) => {
    const aggregatedData = await processProjects(buildProjectItem, {
      where: notInArray(schema.projects.status, ["deprecated", "hidden"]),
    });

    const data = aggregatedData.data.filter((item) => !!item); // remove {data: null} items
    await buildMainList(data);
    await buildFullList(data);
    return aggregatedData;

    async function buildProjectItem(project: ProjectDetails) {
      const repo = project.repo;

      if (!repo) throw new Error("No repo found");
      if (!repo.snapshots?.length)
        return { data: null, meta: { "no snapshot": true } };

      const trends = getProjectTrends(repo.snapshots);
      const tags = project.projectsToTags.map((ptt) => ptt.tag.code);

      // optional data
      const url = getProjectURL(project);
      const logo = project.logo || undefined;
      const packageData = getPackageData(project);

      const data: ProjectItem = {
        name: project.name,
        slug: project.slug,
        added_at: formatDate(project.createdAt),
        description: truncate(getProjectDescription(project), 75),
        stars: repo.stars || 0,
        full_name: project.repo.full_name,
        owner_id: repo.owner_id,
        status: project.status,
        tags,
        trends,
        contributor_count: repo.contributor_count,
        pushed_at: formatDate(repo.last_commit),
        created_at: formatDate(repo.created_at),
        ...(packageData && { ...packageData }),
        ...(url && { url }),
        ...(logo && { logo }),
      };

      return {
        meta: { processed: true },
        data,
      };
    }

    async function buildMainList(allProjects: ProjectItem[]) {
      const allTags = await fetchTags();

      const projects = allProjects.filter(shouldIncludeProjectInMainList);

      logger.info(
        `${projects.length} projects to include in the main JSON file`,
        { trendingToday: getDailyHotProjects(projects) },
      );
      const date = new Date();

      const tags = allTags.filter(
        ({ code }) => !!findProjectByTagId(projects)(code),
      );
      await saveJSON({ date, tags, projects }, "projects.json");
    }

    async function buildFullList(projects: ProjectItem[]) {
      logger.info(`${projects.length} projects to include in the full list`);
      const date = new Date();

      await saveJSON(
        { date, count: projects.length, projects },
        "projects-full.json",
      );
    }

    function shouldIncludeProjectInMainList(project: ProjectItem) {
      const isNew = project.trends.daily === undefined;
      const isPromoted = isPromotedProject(project);
      const isCold = isColdProject(project);
      const isInactive = isInactiveProject(project);
      const isPopular = isPopularPackage(project);

      logger.debug(project.name, { isPromoted, isPopular, isCold, isInactive });

      if (isNew) return false; // projects need at least 2 days of data (to show the daily trend)...
      if (isPromoted || isPopular) return true; // promoted and popular (by number of downloads) projects are always included...
      if (isInactive) return false; // exclude projects without recent Git activity...
      return !isCold; // finally take into account the trend over the last 12 months.
    }

    async function fetchTags() {
      const tags = await db
        .select({
          name: schema.tags.name,
          code: schema.tags.code,
          createdAt: schema.tags.createdAt,
          description: schema.tags.description,
        })
        .from(schema.tags);
      return tags;
    }
  },
});

function isColdProject(project: ProjectItem) {
  const delta = project.trends.yearly;
  if (delta === undefined || delta === null) return false; // only consider projects with data covering 1 year
  return delta < YEARLY_STARS_THRESHOLD;
}

function isPopularPackage(project: ProjectItem) {
  if (!project.downloads) return false;
  return project.downloads > MONTHLY_DOWNLOADS_THRESHOLD;
}

function isInactiveProject(project: ProjectItem) {
  return Math.floor(getYearsSinceLastCommit(project)) > 0;
}

// we want to show "promoted" projects in the UI even if they are cold or inactive
function isPromotedProject(project: ProjectItem) {
  return project.status === "promoted";
}

function getYearsSinceLastCommit(project: ProjectItem) {
  const today = new Date();
  const lastCommit = new Date(project.pushed_at);
  return (today.getTime() - lastCommit.getTime()) / 1000 / 3600 / 24 / 365;
}

const findProjectByTagId = (projects: ProjectItem[]) => (tagId: string) =>
  projects.find(({ tags }) => tags.includes(tagId));

function getDailyHotProjects(projects: ProjectItem[]) {
  return orderBy<ProjectItem>(
    projects,
    [(project) => project.trends.daily],
    ["desc"],
  )
    .slice(0, 5)
    .map((project) => `${project.name} (+${project.trends.daily})`);
}

function formatDate(date: Date | null) {
  return date ? date.toISOString().slice(0, 10) : "";
}
