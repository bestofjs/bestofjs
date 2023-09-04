import { createHallOfFameAPI } from "./api-hall-of-fame";
import { createProjectsAPI } from "./api-projects";
import { createTagsAPI } from "./api-tags";
import {
  APIContext,
  Data,
  FETCH_ALL_PROJECTS_URL,
  getFeaturedRandomList,
  getProjectId,
  getTagsByKey,
  populateProject,
} from "./api-utils";

type RawData = {
  projects: BestOfJS.RawProject[];
  tags: BestOfJS.RawTag[];
  date: string;
};

export function createAPI() {
  async function getData() {
    return await fetchData();
  }

  async function fetchData() {
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

export const api = createAPI();

async function fetchProjectData(): Promise<RawData> {
  try {
    const data = await fetchDataFromRemoteJSON();
    return data as RawData;
  } catch (error) {
    console.error("Unable to fetch data!", (error as Error).message);
    throw error;
  }
}

function fetchDataFromRemoteJSON() {
  const url = FETCH_ALL_PROJECTS_URL + `/projects.json`;
  console.log(`Fetching JSON data from ${url}`);
  const options = {
    next: {
      revalidate: 60 * 60 * 24, // Revalidate every day
      tags: ["all-projects"],
    },
  };
  return fetch(url, options).then((res) => res.json());
}
