import { orderBy, uniq } from "es-toolkit";
import { z } from "zod";

import { schema } from "@repo/db";
import { TAGS_EXCLUDED_FROM_RANKINGS } from "@repo/db/constants";
import { eq, inArray } from "@repo/db/drizzle";
import { flattenSnapshots } from "@repo/db/projects";
import { getMonthlyDelta, type Snapshot } from "@repo/db/snapshots";

import type { Repo } from "@/iteration-helpers/repo-processor";
import { createTask } from "@/task-runner";

import { type Category, fetchCategories } from "./categories";
import type { RisingStarsEntry } from "./rising-stars-types";

export const buildRisingStarsTask = createTask({
  name: "build-rising-stars",
  description: "Build Rising Stars data",
  flags: { year: { type: Number } },
  schema: z.object({ year: z.number() }),
  run: async (context, flags) => {
    const { year } = flags;

    const { data: allProjects, meta } = await context.processRepos(
      async (repo) => {
        const currentYear = new Date().getFullYear();
        const flattenedSnapshots = flattenSnapshots(repo.snapshots);
        const stars =
          currentYear === year
            ? repo.stars
            : getNumberOfStarsAt(year, flattenedSnapshots);

        const delta = getYearlyDelta(repo, flattenedSnapshots, year);

        const months = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
        const monthly = months.map(
          (month) => getMonthlyDelta(flattenedSnapshots, { year, month }).delta,
        );

        // Create a Rising Stars entry from the repo
        // Most of the time it maps to a single project, but sometimes multiple projects
        const entry = createRisingStarsEntry(repo);

        const data: RisingStarsEntry = {
          name: entry.name,
          slug: entry.slug,
          full_name: repo.full_name,
          description: entry.description,
          stars,
          delta,
          monthly,
          tags: entry.tags,
          owner_id: repo.owner_id,
          created_at: repo.created_at,
          ...(entry.url && { url: entry.url }),
          ...(entry.icon && { icon: entry.icon }),
        };
        return {
          meta: { processed: true, projectCount: repo.projects.length },
          data,
        };
      },
      {
        where: inArray(
          schema.repos.id,
          context.db
            .select({ repoId: schema.snapshots.repoId })
            .from(schema.snapshots)
            .where(eq(schema.snapshots.year, year)),
        ),
      },
    );

    const sortedEntries = orderBy(
      allProjects
        .filter((item) => item !== null)
        .filter((item) => item.delta > 0),
      ["delta"],
      ["desc"],
    );

    const categories = await fetchCategories(year);

    const entries = filterProjects(sortedEntries, categories);

    const allTags = await fetchTags();
    const tags = allTags.filter((tag) => isTagIncluded(tag.code, entries));

    context.logger.info(
      `${entries.length} entries included in Rising Stars, ${tags.length} tags`,
    );
    context.logger.info(
      entries.slice(0, 10).map((entry) => `${entry.name}: +${entry.delta}`),
    );

    await context.saveJSON(
      {
        date: new Date(),
        count: entries.length,
        projects: entries,
        tags,
      },
      "rising-stars.json",
    );

    return {
      meta: { count: entries.length, ...meta },
      data: null,
    };

    async function fetchTags() {
      return await context.db
        .select({
          name: schema.tags.name,
          code: schema.tags.code,
        })
        .from(schema.tags);
    }
  },
});

function getNumberOfStarsAt(year: number, snapshots: Snapshot[]) {
  return snapshots.find((snapshot) => snapshot.year === year + 1)?.stars || 0;
}

/**
 * Create a Rising Stars entry from a repo.
 * Maps a repo to an entry, handling cases where multiple projects share the same repo.
 * When multiple projects exist:
 * - Merges project names (e.g., "Project A + Project B")
 * - Aggregates tags from all projects
 * - Uses the primary project's (first by priority) slug, logo, and URL
 */
function createRisingStarsEntry(repo: Repo) {
  const { projects } = repo;

  const firstProject = projects.at(0);
  if (!firstProject) {
    throw new Error(`Repo ${repo.full_name} has no projects`);
  }

  const getDescription = () => {
    const repoDescription = repo.description;
    const fallback = firstProject?.description;
    if (projects.length > 1) {
      return repoDescription || fallback;
    }
    return firstProject.overrideDescription
      ? firstProject.description
      : repoDescription || fallback;
  };

  const getURL = (project: (typeof projects)[0]) => {
    if (project.overrideURL) return project.url;
    const homepage = repo.homepage;
    // Simple URL validation (similar to isValidProjectURL)
    const isValidURL = (url: string | null) => {
      if (!url) return false;
      return url.startsWith("http://") || url.startsWith("https://");
    };
    return homepage && isValidURL(homepage) ? homepage : project.url;
  };

  // If only one project, use it directly
  if (projects.length === 1) {
    return {
      name: firstProject.name,
      slug: firstProject.slug,
      description: getDescription(),
      tags: firstProject.tags.map((tag) => tag.code),
      url: getURL(firstProject) || undefined,
      icon: firstProject.logo || undefined,
    };
  }

  // Multiple projects: aggregate data
  const mergedName = projects.map((p) => p.name).join(" + ");

  // Aggregate all tags from all projects, removing duplicates
  const allTags = projects.flatMap((p) => p.tags.map((tag) => tag.code));
  const uniqueTags = uniq(allTags);

  return {
    name: mergedName,
    slug: firstProject.slug,
    description: getDescription(),
    tags: uniqueTags,
    url: getURL(firstProject) || undefined,
    icon: firstProject.logo || undefined,
  };
}

function getYearlyDelta(repo: Repo, snapshots: Snapshot[], year: number) {
  const finalSnapshot = getFinalSnapshot(snapshots, year);
  if (!finalSnapshot) return 0;
  const finalValue = finalSnapshot.stars;
  const initialValue = wasCreatedThisYear(repo, year)
    ? 0
    : getInitialSnapshot(snapshots, year)?.stars || 0;

  const delta = finalValue - initialValue;
  return delta;
}

function wasCreatedThisYear(repo: Repo, year: number) {
  const { created_at } = repo;
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

function isTagIncluded(tagCode: string, entries: RisingStarsEntry[]) {
  return !!entries.find((entry) => entry.tags.includes(tagCode));
}

// Given an array of Rising Stars entries sorted by the stars added over one year,
// and an array of categories defined in Rising Stars
// Return the entries to be loaded by Rising Stars app
function filterProjects(entries: RisingStarsEntry[], categories: Category[]) {
  const set = new Set();
  addEntriesFromOverallCategory();
  addEntriesFromCategories();
  return getFilteredEntries();

  function addEntriesFromOverallCategory() {
    const category = categories.find((category) => category.key === "all");
    if (!category) throw new Error("Category 'all' not found");
    const count = category.count;
    const selectedEntries = entries
      .filter((entry) => !isExcludedFromRankings(entry))
      .slice(0, count);
    selectedEntries.forEach((entry) => set.add(entry.full_name));
  }

  function addEntriesFromCategories() {
    const subCategories = categories
      .filter((category) => category.key !== "all")
      .filter((category) => category.disabled !== true);
    subCategories.forEach((category) => {
      const selectedEntries = entries
        .filter((entry) => !isExcludedFromRankings(entry))
        .filter(
          (entry) =>
            hasOneOfTags(entry, category.tags || [category.key]) &&
            hasNotOneOfTags(entry, category.excludedTags),
        )
        .filter((entry) => filterExcludeEntryBySlug(entry, category.excluded))
        .slice(0, category.count);
      selectedEntries.forEach((entry) => {
        set.add(entry.full_name);
      });
    });
  }

  function getFilteredEntries() {
    const selectedEntries = entries.filter((entry) => set.has(entry.full_name));
    return selectedEntries;
  }
}

function hasOneOfTags(entry: RisingStarsEntry, tags: string[]) {
  if (!tags) return false;
  return entry.tags.some((tag) => tags.includes(tag));
}

function hasNotOneOfTags(entry: RisingStarsEntry, tags?: string[]) {
  if (!tags) return true;
  return !entry.tags.some((tag) => tags.includes(tag));
}

function filterExcludeEntryBySlug(entry: RisingStarsEntry, slugs?: string[]) {
  if (!slugs) return true;
  return !slugs.includes(entry.slug);
}

function isExcludedFromRankings(entry: RisingStarsEntry) {
  return TAGS_EXCLUDED_FROM_RANKINGS.some((tag) => entry.tags.includes(tag));
}
