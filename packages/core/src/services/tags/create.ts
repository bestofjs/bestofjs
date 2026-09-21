import { nanoid } from "nanoid";
import slugify from "slugify";

import { db } from "../..";
import * as schema from "../../schema";
import { lockTagTaxonomy } from "./closure";

export async function createTag(tagName: string) {
  const values = {
    id: nanoid(),
    name: tagName,
    code: slugify(tagName).toLowerCase(),
  };

  return await db.transaction(async (tx) => {
    await lockTagTaxonomy(tx);
    const [createdTag] = await tx
      .insert(schema.tags)
      .values(values)
      .returning();
    await tx.insert(schema.tagClosure).values({
      descendantId: createdTag.id,
      ancestorId: createdTag.id,
      depth: 0,
    });
    return createdTag;
  });
}
