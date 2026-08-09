import { eq } from "drizzle-orm";

import { db } from "..";
import * as schema from "../schema";

export async function getTagBySlug(slug: string) {
  const tag = await db.query.tags.findFirst({
    where: eq(schema.tags.code, slug),
  });
  return tag;
}
