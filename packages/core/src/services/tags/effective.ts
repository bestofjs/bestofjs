import { asc, eq, inArray, min } from "drizzle-orm";

import type { DB } from "../../index";
import * as schema from "../../schema";

export type EffectiveTag = Pick<
  typeof schema.tags.$inferSelect,
  "id" | "code" | "name" | "description" | "facet" | "parentTagId"
> & {
  depth: number;
  direct: boolean;
};

/** Resolve direct project assignments to unique, deterministically ordered effective tags. */
export async function findEffectiveTagsByProjectIds(
  db: DB,
  projectIds: string[],
) {
  if (projectIds.length === 0) return new Map<string, EffectiveTag[]>();

  const depth = min(schema.tagClosure.depth).as("depth");
  const rows = await db
    .select({
      projectId: schema.projectsToTags.projectId,
      id: schema.tags.id,
      code: schema.tags.code,
      name: schema.tags.name,
      description: schema.tags.description,
      facet: schema.tags.facet,
      parentTagId: schema.tags.parentTagId,
      depth,
    })
    .from(schema.projectsToTags)
    .innerJoin(
      schema.tagClosure,
      eq(schema.projectsToTags.tagId, schema.tagClosure.descendantId),
    )
    .innerJoin(schema.tags, eq(schema.tagClosure.ancestorId, schema.tags.id))
    .where(inArray(schema.projectsToTags.projectId, projectIds))
    .groupBy(schema.projectsToTags.projectId, schema.tags.id)
    .orderBy(
      asc(schema.projectsToTags.projectId),
      asc(depth),
      asc(schema.tags.name),
    );

  const grouped = Map.groupBy(rows, (row) => row.projectId);
  return new Map(
    projectIds.map((projectId) => [
      projectId,
      (grouped.get(projectId) ?? []).map(({ projectId: _, depth, ...tag }) => ({
        ...tag,
        depth: depth ?? 0,
        direct: depth === 0,
      })),
    ]),
  );
}
