import { eq } from "drizzle-orm";

import { db } from "..";
import * as schema from "../schema";

type Project = typeof schema.projects.$inferInsert;

export async function updateProjectById(
  projectId: string,
  data: Partial<Project>,
) {
  const result = await db
    .update(schema.projects)
    .set(data)
    .where(eq(schema.projects.id, projectId))
    .returning();
  console.log("Project updated", result);
}
