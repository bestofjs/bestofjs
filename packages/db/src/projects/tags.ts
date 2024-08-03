import { and, asc, eq, inArray } from "drizzle-orm";

type Tag = {
  id: string;
  name: string;
};

import { getDatabase } from "..";
import * as schema from "../schema";

export function getAllTags() {
  const db = getDatabase();
  const tags = db.query.tags.findMany({
    orderBy: asc(schema.tags.name),
  });
  return tags;
}

export async function saveTags(projectId: string, tags: Tag[]) {
  const db = getDatabase();
  const tagIds = tags.map((tag) => tag.id);
  const currentTagRecords = await db.query.projectsToTags.findMany({
    where: eq(schema.projectsToTags.projectId, projectId),
  });
  const currentTagIds = currentTagRecords.map((record) => record.tagId);

  const tagsToRemove = currentTagIds.filter((tagId) => !tagIds.includes(tagId));
  const tagsToAdd = tagIds.filter((tagId) => !currentTagIds.includes(tagId));
  console.log({ tagsToRemove, tagsToAdd });

  if (tagsToAdd.length > 0) {
    await addTagsToProject(projectId, tagsToAdd);
  }
  if (tagsToRemove.length > 0) {
    await removeTagsFromProject(projectId, tagsToRemove);
  }
}

export async function addTagsToProject(projectId: string, tagIds: string[]) {
  const db = getDatabase();
  const values = tagIds.map((tagId) => ({
    projectId,
    tagId,
    // createdAt: new Date(),
  }));
  await db.insert(schema.projectsToTags).values(values);
}

export async function removeTagsFromProject(
  projectId: string,
  tagIds: string[]
) {
  const db = getDatabase();
  await db
    .delete(schema.projectsToTags)
    .where(
      and(
        eq(schema.projectsToTags.projectId, projectId),
        inArray(schema.projectsToTags.tagId, tagIds)
      )
    );
}
