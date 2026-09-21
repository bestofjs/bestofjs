import { sql } from "drizzle-orm";

import type { DB } from "../../index";
import * as schema from "../../schema";
import { buildTagClosure } from "./taxonomy.shared";

type TaxonomyReader = Pick<DB, "select">;
type TaxonomyDatabase = Pick<DB, "delete" | "execute" | "insert" | "select">;

/** Serialize graph writers, including ordinary writes to the tags table. */
export async function lockTagTaxonomy(database: Pick<DB, "execute">) {
  await database.execute(
    sql`lock table ${schema.tags} in share row exclusive mode`,
  );
}

/** Validate source adjacency state and derive closure without writing it. */
export async function deriveTagClosure(database: TaxonomyReader) {
  const tags = await database
    .select({
      id: schema.tags.id,
      facet: schema.tags.facet,
      parentTagId: schema.tags.parentTagId,
    })
    .from(schema.tags);
  return buildTagClosure(tags);
}

/**
 * Rebuild the derived closure index from the adjacency-list source of truth.
 * Callers that mutate taxonomy state must pass their transaction here.
 */
export async function rebuildTagClosure(database: TaxonomyDatabase) {
  const closure = await deriveTagClosure(database);

  await database.delete(schema.tagClosure);
  if (closure.length > 0) {
    await database.insert(schema.tagClosure).values(closure);
  }
  return closure;
}
