import { FETCH_ALL_PROJECTS_URL, RawData } from "./api-utils";
import { createAPI } from "./create-api";

export const api = createAPI(fetchProjectData);

async function fetchProjectData(): Promise<RawData> {
  try {
    const data = await fetchDataFromRemoteJSON();
    return data as RawData;
  } catch (error) {
    console.error("Unable to fetch remote JSON data", (error as Error).message);
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
