import { eq } from "drizzle-orm";

import { getDatabase } from "..";
import * as schema from "../schema";

export async function getTagBySlug(slug: string) {
  const db = getDatabase();
  const tag = await db.query.tags.findFirst({
    where: eq(schema.tags.code, slug),
  });
  return tag;
}
