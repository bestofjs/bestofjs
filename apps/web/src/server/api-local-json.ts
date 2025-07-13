import path from "node:path";
import fs from "fs-extra";

import type { RawData } from "./api-utils";
import { createAPI } from "./create-api";

export const api = createAPI(fetchProjectData);

let data: RawData; // cache the data to avoid reading the file system on each request

async function fetchProjectData(): Promise<RawData> {
  try {
    if (!data) data = (await fetchDataFromFileSystem()) as RawData;
    return data;
  } catch (error) {
    console.error("Unable to fetch local JSON data", (error as Error).message);
    throw error;
  }
}

function fetchDataFromFileSystem() {
  console.log("Fetch from the file system");
  const filepath = path.join(process.cwd(), "public", "data/projects.json");
  return fs.readJSON(filepath);
}
