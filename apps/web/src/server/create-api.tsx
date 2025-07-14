import { createProjectsAPI } from "./api-projects";
import { createRankingsAPI } from "./api-rankings";
import { createTagsAPI } from "./api-tags";
import {
  type APIContext,
  type Data,
  getFeaturedRandomList,
  getTagsByKey,
  populateProject,
  type RawData,
} from "./api-utils";

export function createAPI(fetchProjectData: () => Promise<RawData>) {
  async function getData() {
    const { projects, tags: rawTags, date } = await fetchProjectData();
    const tagsByKey = getTagsByKey(rawTags, projects);
    const projectsBySlug: Data["projectsBySlug"] = {};
    projects.forEach((project) => {
      projectsBySlug[project.slug] = project;
    });
    const featuredProjectIds = getFeaturedRandomList(projects);

    return {
      projectCollection: projects,
      featuredProjectIds,
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
  const rankingAPI = createRankingsAPI(projectsAPI);

  return {
    projects: projectsAPI,
    tags: tagsAPI,
    rankings: rankingAPI,
  };
}
