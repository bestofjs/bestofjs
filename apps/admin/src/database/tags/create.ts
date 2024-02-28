"use server";

import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import slugify from "slugify";

import * as schema from "@/database/schema";

import { getDatabase } from "..";

export async function createTag(tagName: string) {
  const db = getDatabase();

  const values = {
    id: nanoid(),
    name: tagName,
    code: slugify(tagName),
    createdAt: new Date(),
  };

  const createdTags = await db.insert(schema.tags).values(values).returning();

  revalidatePath(`/tags`);

  return createdTags[0];
}
