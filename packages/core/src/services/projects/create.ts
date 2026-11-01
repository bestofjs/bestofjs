import { nanoid } from "nanoid";

import { db } from "../..";
import * as schema from "../../schema";
import { generateDefaultSlug } from "../../shared-schemas";

export type { CreateProjectInput } from "./create-input";
export {
  createProjectCliInputSchema,
  createProjectInputSchema,
  parseGitHubRepo,
} from "./create-input";
export type { CreateProjectResult } from "./create-project";
export { createProject } from "./create-project";

/** For monorepos, add a new project to an existing repository */
export async function addProjectToRepo({
  name,
  description,
  repoId,
}: {
  name: string;
  description: string;
  repoId: string;
}) {
  const createdProjects = await db
    .insert(schema.projects)
    .values({
      id: nanoid(),
      createdAt: new Date(),
      repoId,
      name,
      description,
      slug: generateDefaultSlug(name),
      status: "active",
    })
    .returning();

  return createdProjects[0];
}
