import { eq } from "drizzle-orm";

import { getDatabase } from "..";
import * as schema from "../schema";

type Project = typeof schema.projects.$inferInsert;

export async function updateProjectById(
  projectId: string,
  data: Partial<Project>
) {
  console.log("Update", projectId, data);

  const db = getDatabase();
  const result = await db
    .update(schema.projects)
    .set(data)
    .where(eq(schema.projects.id, projectId));
  console.log("Done", result);
}
