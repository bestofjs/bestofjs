import { eq } from "drizzle-orm";

import type { DB } from "../..";
import * as schema from "../../schema";
import { lockTagTaxonomy, rebuildTagClosure } from "./closure";
import { buildTagClosure, type TagFacet } from "./taxonomy.shared";

export type EditableTagData = Omit<
  typeof schema.tags.$inferInsert,
  "id" | "createdAt" | "updatedAt" | "facet" | "parentTagId"
>;

export type TagUpdateData = Partial<EditableTagData> & {
  facet?: TagFacet | null;
  parentTagId?: string | null;
};

export async function updateTagWithTaxonomy(
  database: DB,
  tagId: string,
  data: TagUpdateData,
) {
  return await database.transaction(async (tx) => {
    await lockTagTaxonomy(tx);
    const tags = await tx
      .select({
        id: schema.tags.id,
        facet: schema.tags.facet,
        parentTagId: schema.tags.parentTagId,
      })
      .from(schema.tags);
    const tag = tags.find((item) => item.id === tagId);
    if (!tag) throw new Error(`Tag not found: ${tagId}`);

    if (
      data.parentTagId &&
      !tags.some((item) => item.id === data.parentTagId)
    ) {
      throw new Error(`Parent tag not found: ${data.parentTagId}`);
    }

    if ("facet" in data) tag.facet = data.facet ?? null;
    if ("parentTagId" in data) tag.parentTagId = data.parentTagId ?? null;

    // Validation happens before either persisted table is changed.
    buildTagClosure(tags);
    await tx
      .update(schema.tags)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.tags.id, tagId));

    if ("parentTagId" in data) await rebuildTagClosure(tx);
  });
}
