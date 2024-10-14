import { nanoid } from "nanoid";
import slugify from "slugify";

import { db } from "..";
import * as schema from "../schema";

export async function createTag(tagName: string) {
  const values = {
    id: nanoid(),
    name: tagName,
    code: slugify(tagName).toLowerCase(),
  };

  const createdTags = await db.insert(schema.tags).values(values).returning();
  console.log("Tag created", createdTags[0]);
  return createdTags[0];
}
