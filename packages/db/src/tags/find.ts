import { asc, count, eq } from "drizzle-orm";

import { db } from "../index";
import * as schema from "../schema";

export async function findTags() {
  const tags = await db
    .select({
      name: schema.tags.name,
      code: schema.tags.code,
      createdAt: schema.tags.createdAt,
      description: schema.tags.description,
      count: count(schema.projectsToTags.projectId),
    })
    .from(schema.tags)
    .leftJoin(
      schema.projectsToTags,
      eq(schema.projectsToTags.tagId, schema.tags.id),
    )
    .groupBy(() => [
      schema.tags.name,
      schema.tags.code,
      schema.tags.createdAt,
      schema.tags.description,
    ])
    .orderBy(asc(schema.tags.name));
  return tags;
}
