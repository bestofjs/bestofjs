import { createHallOfFameAPI } from "./api-hall-of-fame";
import { createProjectsAPI } from "./api-projects";
import { createTagsAPI } from "./api-tags";
import {
  APIContext,
  Data,
  RawData,
  getFeaturedRandomList,
  getProjectId,
  getTagsByKey,
  populateProject,
} from "./api-utils";

export function createAPI(fetchProjectData: () => Promise<RawData>) {
  async function getData() {
    const { projects, tags: rawTags, date } = await fetchProjectData();
    const tagsByKey = getTagsByKey(rawTags, projects);
    const projectsBySlug: Data["projectsBySlug"] = {};
    projects.forEach((project) => {
      projectsBySlug[getProjectId(project)] = project;
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
  const hallOfFameAPI = createHallOfFameAPI(context);

  return {
    projects: projectsAPI,
    tags: tagsAPI,
    hallOfFame: hallOfFameAPI,
  };
}
