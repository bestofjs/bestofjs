import { asc, count, desc, eq, ilike, inArray, sql } from "drizzle-orm";

import { DB, getDatabase } from "@/database";
import * as schema from "@/database/schema";

export async function findTags() {
  const db: DB = getDatabase();
  const tags = await db.query.tags.findMany({
    orderBy: [asc(schema.tags.name)],
  });
  return tags;
}
