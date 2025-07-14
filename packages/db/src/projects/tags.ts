import { and, asc, eq, inArray } from "drizzle-orm";

import { db } from "..";
import * as schema from "../schema";

export function getAllTags() {
  const tags = db.query.tags.findMany({
    orderBy: asc(schema.tags.name),
  });
  return tags;
}

export async function saveTags(projectId: string, tagIds: string[]) {
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
  const values = tagIds.map((tagId) => ({
    projectId,
    tagId,
    // createdAt: new Date(),
  }));
  await db.insert(schema.projectsToTags).values(values);
}

export async function removeTagsFromProject(
  projectId: string,
  tagIds: string[],
) {
  await db
    .delete(schema.projectsToTags)
    .where(
      and(
        eq(schema.projectsToTags.projectId, projectId),
        inArray(schema.projectsToTags.tagId, tagIds),
      ),
    );
}
