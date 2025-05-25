"use server";

// The only purpose of this file is to export server actions we can include from client components to avoid the error:
// > It is not allowed to define inline "use server" annotated Server Actions in Client Components.
// > To use Server Actions in a Client Component, you can either export them from a separate file with "use server" at the top, or pass them down through props from a Server Component."
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
