"use server";

import { createProject } from "@repo/db/projects";

export async function createProjectAction(gitHubURL: string) {
  const project = await createProject(gitHubURL);
  return project;
}
