import { eq } from "drizzle-orm";

import { db } from "..";
import * as schema from "../schema";

export type EditableTagData = Omit<
  typeof schema.tags.$inferInsert,
  "id" | "createdAt" | "updatedAt"
>;

export async function updateTagById(
  tagId: string,
  data: Partial<EditableTagData>,
) {
  const result = await db
    .update(schema.tags)
    .set(data)
    .where(eq(schema.tags.id, tagId));
  console.log("Tag updated successfully", result);
}
