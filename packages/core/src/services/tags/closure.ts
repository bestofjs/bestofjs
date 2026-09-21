import type { DB } from "../../index";
import * as schema from "../../schema";
import { buildTagClosure } from "./taxonomy.shared";

type TaxonomyDatabase = Pick<DB, "delete" | "insert" | "select">;

/**
 * Rebuild the derived closure index from the adjacency-list source of truth.
 * Callers that mutate taxonomy state must pass their transaction here.
 */
export async function rebuildTagClosure(database: TaxonomyDatabase) {
  const tags = await database
    .select({
      id: schema.tags.id,
      facet: schema.tags.facet,
      parentTagId: schema.tags.parentTagId,
    })
    .from(schema.tags);
  const closure = buildTagClosure(tags);

  await database.delete(schema.tagClosure);
  if (closure.length > 0) {
    await database.insert(schema.tagClosure).values(closure);
  }
  return closure;
}
