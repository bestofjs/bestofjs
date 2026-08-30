import { excludedTagCodes } from "@/config/apps";

import { createProjectsAPI } from "./api-projects";
import { createRankingsAPI } from "./api-rankings";
import { createTagsAPI } from "./api-tags";
import {
  type APIContext,
  type Data,
  getTagsByKey,
  populateProject,
  type RawData,
} from "./api-utils";

export function createAPI(fetchProjectData: () => Promise<RawData>) {
  async function getData() {
    const {
      projects: allProjects,
      tags: allTags,
      date,
    } = await fetchProjectData();

    // The single place this deployment's tag exclusion is applied to the static
    // JSON collection: every consumer of `getData()` (the search palette index,
    // the monthly rankings lookup) reads the filtered set, so none of them can
    // forget. Filtering before `getTagsByKey()` also means the tag counters are
    // computed on the filtered collection rather than corrected afterwards.
    const { projects, rawTags } = excludeTags(allProjects, allTags);

    const tagsByKey = getTagsByKey(rawTags, projects);
    const projectsBySlug: Data["projectsBySlug"] = {};
    projects.forEach((project) => {
      projectsBySlug[project.slug] = project;
    });

    return {
      projectCollection: projects,
      tagCollection: Object.values(tagsByKey),
      populate: populateProject(tagsByKey),
      tagsByKey,
      projectsBySlug,
      lastUpdateDate: new Date(date),
    };
  }

  const context: APIContext = {
    getData,
  };

  const projectsAPI = createProjectsAPI(context);
  const tagsAPI = createTagsAPI(context);

  // Dependent APIs
  const rankingAPI = createRankingsAPI(
    projectsAPI,
    excludedTagCodes.length > 0,
  );

  return {
    projects: projectsAPI,
    tags: tagsAPI,
    rankings: rankingAPI,
  };
}

/**
 * Drops both the excluded tags and every project carrying one. Returns the
 * inputs unchanged on the main deployment, where the list is empty.
 */
function excludeTags(
  projects: BestOfJS.RawProject[],
  tags: BestOfJS.RawTag[],
): { projects: BestOfJS.RawProject[]; rawTags: BestOfJS.RawTag[] } {
  if (excludedTagCodes.length === 0) return { projects, rawTags: tags };
  return {
    projects: projects.filter(
      (project) => !project.tags.some((tag) => excludedTagCodes.includes(tag)),
    ),
    rawTags: tags.filter((tag) => !excludedTagCodes.includes(tag.code)),
  };
}
