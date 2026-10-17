import { countDistinct, eq } from "drizzle-orm";

import { db } from "../..";
import * as schema from "../../schema";
import { lockTagTaxonomy, rebuildTagClosure } from "./closure";
import type { TagFacet } from "./taxonomy.shared";
import {
  type EditableTagData,
  type TagUpdateData,
  updateTagWithTaxonomy,
} from "./update-with-taxonomy";

export {
  type EditableTagData,
  type TagUpdateData,
  updateTagWithTaxonomy,
} from "./update-with-taxonomy";

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
