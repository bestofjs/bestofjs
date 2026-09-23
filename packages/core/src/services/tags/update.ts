import { countDistinct, eq } from "drizzle-orm";

import { type DB, db } from "../..";
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

export async function updateTagById(
  tagId: string,
  data: Partial<EditableTagData>,
) {
  if ("facet" in data || "parentTagId" in data) {
    throw new Error(
      "Facet and parent changes must use the guarded taxonomy operations",
    );
  }
  const result = await db
    .update(schema.tags)
    .set(data)
    .where(eq(schema.tags.id, tagId));
  console.log("Tag updated successfully", result);
}

export async function setTagParent(tagId: string, parentTagId: string | null) {
  return await updateTagWithTaxonomyById(tagId, { parentTagId });
}

/** Atomically validate and update any combination of tag and taxonomy fields. */
export async function updateTagWithTaxonomyById(
  tagId: string,
  data: TagUpdateData,
) {
  return await updateTagWithTaxonomy(db, tagId, data);
}

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

export async function setTagFacet(tagId: string, facet: TagFacet | null) {
  return await updateTagWithFacetById(tagId, { facet });
}

/** Atomically update ordinary tag fields and its guarded facet. */
export async function updateTagWithFacetById(
  tagId: string,
  data: Partial<EditableTagData> & { facet: TagFacet | null },
) {
  return await updateTagWithTaxonomyById(tagId, data);
}

export async function deleteTag(tagId: string) {
  return await db.transaction(async (tx) => {
    await lockTagTaxonomy(tx);
    const children = await tx
      .select({ id: schema.tags.id })
      .from(schema.tags)
      .where(eq(schema.tags.parentTagId, tagId));
    if (children.length > 0) {
      throw new Error(
        `Cannot delete tag: ${children.length} child tag${children.length === 1 ? " depends" : "s depend"} on it`,
      );
    }

    const [usage] = await tx
      .select({ count: countDistinct(schema.projectsToTags.projectId) })
      .from(schema.projectsToTags)
      .where(eq(schema.projectsToTags.tagId, tagId));
    await tx.delete(schema.tags).where(eq(schema.tags.id, tagId));
    return { affectedProjectCount: usage.count };
  });
}

/** Repair/audit entry point for imports and restores. */
export async function rebuildTagClosureIndex() {
  return await db.transaction(async (tx) => {
    await lockTagTaxonomy(tx);
    return await rebuildTagClosure(tx);
  });
}
