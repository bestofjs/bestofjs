import { connection } from "next/server";

import { db, schema } from "@repo/core";
import { findTags } from "@repo/core/services/tags";

export async function getTags() {
  // Render at request time: the DB driver uses `crypto.randomBytes`, which
  // Cache Components rejects during prerendering.
  await connection();
  // Aliases only matter to the admin search box, so they are fetched here
  // rather than added to the shared `findTags()` that the web app also calls.
  const [tags, aliasRows] = await Promise.all([
    findTags(),
    db
      .select({ id: schema.tags.id, aliases: schema.tags.aliases })
      .from(schema.tags),
  ]);
  const aliasesById = new Map(aliasRows.map((row) => [row.id, row.aliases]));
  return tags.map((tag) => ({
    ...tag,
    aliases: aliasesById.get(tag.id) ?? [],
  }));
}

export type AdminTag = Awaited<ReturnType<typeof getTags>>[number];
