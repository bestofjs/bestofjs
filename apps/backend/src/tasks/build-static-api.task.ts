import { schema } from "@repo/db";
import {
  getPackageData,
  getProjectDescription,
  getProjectTrends,
  getProjectURL,
} from "@repo/db/projects";
import { Task } from "@/task-runner";
import { ProjectItem } from "./static-api-types";

export const buildStaticApiTask: Task = {
  name: "build-static-api",
  description:
    "Build a static API from the database, to be used by the frontend app.",

  run: async ({ db, logger, processProjects, saveJSON }) => {
    const results = await processProjects(async (project) => {
      const repo = project.repo;

      if (!repo) throw new Error("No repo found");
      if (!repo.snapshots?.length)
        return { data: null, meta: { "no snapshot": true } };

      const trends = getProjectTrends(repo.snapshots);
      const tags = project.projectsToTags.map((ptt) => ptt.tag.code);

      const url = getProjectURL(project);
      const icon = project.logo || undefined;
      const packageData = getPackageData(project);

      const data: ProjectItem = {
        name: project.name,
        added_at: formatDate(project.createdAt),
        description: truncate(getProjectDescription(project), 75),
        stars: repo.stars || 0,
        full_name: project.repo.full_name,
        owner_id: repo.owner_id,
        status: project.status || "active",
        tags,
        trends,
        contributor_count: repo.contributor_count,
        pushed_at: formatDate(repo.last_commit),
        created_at: formatDate(repo.created_at),
        ...(packageData && { ...packageData }),
        ...(url && { url }),
        ...(icon && { icon }),
      };

      return {
        meta: { processed: true },
        data,
      };
    });

    const data = results.data.filter((item) => !!item);
    await buildMainList(data);
    await buildFullList(data);
    return results;

    async function buildMainList(allProjects: ProjectItem[]) {
      const allTags = await fetchTags();

      const projects = allProjects
        .filter((project) => project.trends.daily !== undefined) // new projects need to include at least the daily trend
        .filter(
          (project) => isPromotedProject(project) || !isColdProject(project)
        )
        .filter(
          (project) => isPromotedProject(project) || !isInactiveProject(project)
        );
      // .map(compactProjectData); // we don't need the `version` in `projects.json`

      logger.info(
        `${projects.length} projects to include in the main JSON file`
      );
      const date = new Date();

      const tags = allTags.filter(
        ({ code }) => !!findProjectByTagId(projects)(code)
      );
      await saveJSON({ date, tags, projects }, "projects.json");
    }

    async function buildFullList(projects: ProjectItem[]) {
      logger.info(`${projects.length} projects to include in the full list`);
      const date = new Date();

      await saveJSON(
        { date, count: projects.length, projects },
        "projects-full.json"
      );
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
};

function isColdProject(project: ProjectItem) {
  const delta = project.trends.yearly;
  if (delta === undefined || delta === null) return false; // only consider projects with data covering 1 year
  if (!isPopularPackage(project)) return false; // exclude projects with a lots of downloads (E.g. `Testem`)
  return delta < 50;
}

function isPopularPackage(project: ProjectItem) {
  if (!project.downloads) return false;
  return project.downloads > 100000;
}

function isInactiveProject(project: ProjectItem) {
  const delta = project.trends.yearly;
  if (delta === undefined || delta === null) return false; // only consider projects with data covering 1 year
  return Math.floor(getYearsSinceLastCommit(project)) > 0 && delta < 100;
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

function formatDate(date: Date | null) {
  return date ? date.toISOString().slice(0, 10) : "";
}

function truncate(input: string, maxLength = 50) {
  const isTruncated = input.length > maxLength;
  return isTruncated ? `${input.slice(0, maxLength)}...` : input;
}
