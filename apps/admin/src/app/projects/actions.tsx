"use server";

import { addProjectToRepo, createProject } from "@repo/db/projects";

export async function createProjectAction(gitHubURL: string) {
  const project = await createProject(gitHubURL);
  return project;
}

export async function addProjectToRepoAction({
  name,
  description,
  repoId,
}: {
  name: string;
  description: string;
  repoId: string;
}) {
  const project = await addProjectToRepo({ name, description, repoId });
  return project;
}
