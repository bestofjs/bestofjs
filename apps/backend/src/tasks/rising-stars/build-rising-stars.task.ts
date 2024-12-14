import { orderBy } from "es-toolkit";
import { z } from "zod";

import { schema } from "@repo/db";
import { TAGS_EXCLUDED_FROM_RANKINGS } from "@repo/db/constants";
import { and, eq, inArray, notInArray } from "@repo/db/drizzle";
import {
  flattenSnapshots,
  getProjectDescription,
  ProjectDetails,
} from "@repo/db/projects";
import { getMonthlyDelta, Snapshot } from "@repo/db/snapshots";
import { createTask } from "@/task-runner";
import { Category, fetchCategories } from "./categories";

type Project = {
  name: string;
  slug: string;
  full_name: string;
  description: string;
  stars: number | null;
  delta: number;
  monthly: (number | undefined)[];
  tags: string[];
  owner_id: number;
  icon?: string;
  created_at: Date;
};

export const buildRisingStarsTask = createTask({
  name: "build-rising-stars",
  description: "Build Rising Stars data",
  flags: {
    year: { type: Number, default: 2024 },
  },
  schema: z.object({ year: z.number() }),
  run: async (context, flags) => {
    const { year } = flags;

    const { data: allProjects, meta } = await context.processProjects(
      async (project) => {
        const stars = project.repo.stars;
        const snapshots = project.repo.snapshots;
        const flattenedSnapshots = flattenSnapshots(snapshots);

        const delta = getYearlyDelta(project, flattenedSnapshots, year);

        const months = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
        const monthly = months.map(
          (month) => getMonthlyDelta(flattenedSnapshots, { year, month }).delta
        );

        const data: Project = {
          name: project.name,
          slug: project.slug,
          full_name: project.repo.full_name,
          description: getProjectDescription(project),
          stars,
          delta,
          monthly,
          tags: project.tags.map((tag) => tag.code),
          owner_id: project.repo.owner_id,
          ...(project.logo && { icon: project.logo }),
          created_at: project.repo.created_at,
        };
        return {
          meta: { processed: true },
          data,
        };
      },
      {
        where: and(
          notInArray(schema.projects.status, ["deprecated", "hidden"]),
          inArray(
            schema.repos.id,
            context.db
              .select({ repoId: schema.snapshots.repoId })
              .from(schema.snapshots)
              .where(eq(schema.snapshots.year, year))
          )
        ),
      }
    );

    const sortedProjects = orderBy(
      allProjects
        .filter((item) => item !== null)
        .filter((item) => item.delta > 0),
      ["delta"],
      ["desc"]
    );

    const categories = await fetchCategories(year);

    const projects = filterProjects(sortedProjects, categories);

    const allTags = await fetchTags();
    const tags = allTags.filter((tag) => isTagIncluded(tag.code, projects));

    context.logger.info(
      `${projects.length} projects included in Rising Stars, ${tags.length} tags`
    );
    context.logger.info(
      projects
        .slice(0, 10)
        .map((project) => `${project.name}: +${project.delta}`)
    );

    await context.saveJSON(
      {
        date: new Date(),
        count: projects.length,
        projects,
        tags,
      },
      "rising-stars.json"
    );

    return {
      meta: { count: projects.length, ...meta },
      data: null,
    };

    async function fetchTags() {
      return await context.db
        .select({
          name: schema.tags.name,
          code: schema.tags.code,
          createdAt: schema.tags.createdAt,
          description: schema.tags.description,
        })
        .from(schema.tags);
    }
  },
});

function getYearlyDelta(
  project: ProjectDetails,
  snapshots: Snapshot[],
  year: number
) {
  const finalSnapshot = getFinalSnapshot(snapshots, year);
  if (!finalSnapshot) return 0;
  const finalValue = finalSnapshot.stars;
  const initialValue = wasCreatedThisYear(project, year)
    ? 0
    : getInitialSnapshot(snapshots, year)?.stars || 0;

  const delta = finalValue - initialValue;
  return delta;
}

function wasCreatedThisYear(project: ProjectDetails, year: number) {
  const { created_at } = project.repo;
  const createdYear = created_at.getFullYear();
  return createdYear === year;
}

function getInitialSnapshot(snapshots: Snapshot[], year: number) {
  return snapshots.find((snapshot) => snapshot.year === year);
}

function getFinalSnapshot(snapshots: Snapshot[], year: number) {
  const firstSnapshotNextYear = getInitialSnapshot(snapshots, year + 1);
  if (firstSnapshotNextYear) {
    return firstSnapshotNextYear;
  }
  const reversedSnapshots = snapshots.slice();
  reversedSnapshots.reverse();
  return reversedSnapshots.find((snapshot) => snapshot.year === year);
}

function isTagIncluded(tagCode: string, projects: Project[]) {
  return !!projects.find((project) => project.tags.includes(tagCode));
}

// Given an array of projects sorted by the star added over one year,
// and an array of categories defined in Rising Stars
// Return the projects to be loaded by Rising Stars app
function filterProjects(projects: Project[], categories: Category[]) {
  const set = new Set();
  addProjectsFromOverallCategory();
  addProjectsFromCategories();
  return getFilteredProjects();

  function addProjectsFromOverallCategory() {
    const category = categories.find((category) => category.key === "all");
    if (!category) throw new Error("Category 'all' not found");
    const count = category.count;
    const selectedProjects = projects
      .filter(
        (project) =>
          !TAGS_EXCLUDED_FROM_RANKINGS.some((tag) => project.tags.includes(tag))
      )
      .slice(0, count);
    selectedProjects.forEach((project) => set.add(project.full_name));
  }

  function addProjectsFromCategories() {
    const subCategories = categories
      .filter((category) => category.key !== "all")
      .filter((category) => category.disabled !== true);
    subCategories.forEach((category) => {
      const selectedProjects = projects
        .filter((project) =>
          hasOneOfTags(project, category.tags || [category.key])
        )
        .filter((project) =>
          filterExcludeProjectBySlug(project, category.excluded)
        )
        .slice(0, category.count);
      selectedProjects.forEach((project) => {
        set.add(project.full_name);
      });
    });
  }

  function getFilteredProjects() {
    const selectedProjects = projects.filter((project) =>
      set.has(project.full_name)
    );
    return selectedProjects;
  }
}

function hasOneOfTags(project: Project, tags: string[]) {
  if (!tags) return false;
  return project.tags.some((tag) => tags.includes(tag));
}

function filterExcludeProjectBySlug(project: Project, slugs?: string[]) {
  if (!slugs) return true;
  return !slugs.includes(project.slug);
}
