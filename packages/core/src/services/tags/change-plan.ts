import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";

import type { DB } from "../..";
import * as schema from "../../schema";
import { projectSlugSchema, tagCodeSchema } from "../../shared-schemas";
import { TAG_FACETS } from "./taxonomy.shared";
import { type TagUpdateData, updateTagWithTaxonomy } from "./update";

const facetSchema = z.enum(TAG_FACETS);

const updateTagOperationSchema = z.object({
  op: z.literal("update-tag"),
  code: tagCodeSchema,
  set: z
    .object({
      name: z.string().trim().min(1).optional(),
      description: z.string().nullable().optional(),
      aliases: z.array(z.string().trim().min(1)).nullable().optional(),
      facet: facetSchema.nullable().optional(),
      parentCode: tagCodeSchema.nullable().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one tag field must be supplied",
    }),
});

const addProjectTagsOperationSchema = z.object({
  op: z.literal("add-project-tags"),
  project: projectSlugSchema,
  tags: z.array(tagCodeSchema).min(1),
});

const removeProjectTagsOperationSchema = z.object({
  op: z.literal("remove-project-tags"),
  project: projectSlugSchema,
  tags: z.array(tagCodeSchema).min(1),
});

export const taggingPlanSchema = z.object({
  schemaVersion: z.literal(1).optional().default(1),
  ops: z.array(
    z.discriminatedUnion("op", [
      updateTagOperationSchema,
      addProjectTagsOperationSchema,
      removeProjectTagsOperationSchema,
    ]),
  ),
});

export type TaggingPlan = z.infer<typeof taggingPlanSchema>;

export const EMPTY_TAGGING_PLAN: TaggingPlan = {
  schemaVersion: 1,
  ops: [],
};

type OperationResult = {
  index: number;
  op: TaggingPlan["ops"][number]["op"];
  target: string;
  status: "added" | "removed" | "unchanged" | "updated";
  changes?: Record<string, { from: unknown; to: unknown }>;
  tags?: string[];
};

export async function runTaggingPlan({ db }: { db: DB }, plan: TaggingPlan) {
  const ops: OperationResult[] = [];

  for (let index = 0; index < plan.ops.length; index++) {
    const op = plan.ops[index];
    switch (op.op) {
      case "update-tag":
        ops.push(await updateTag(db, op, index));
        break;
      case "add-project-tags":
        ops.push(await addProjectTags(db, op, index));
        break;
      case "remove-project-tags":
        ops.push(await removeProjectTags(db, op, index));
        break;
    }
  }

  const unchanged = ops.filter(({ status }) => status === "unchanged").length;

  return {
    summary: {
      changed: ops.length - unchanged,
      unchanged,
    },
    ops,
  };
}

async function updateTag(
  db: DB,
  op: z.infer<typeof updateTagOperationSchema>,
  index: number,
): Promise<OperationResult> {
  const tag = await db.query.tags.findFirst({
    where: eq(schema.tags.code, op.code),
  });
  if (!tag) throw new Error(`Tag not found: ${op.code}`);

  const data: TagUpdateData = {};
  const changes: NonNullable<OperationResult["changes"]> = {};

  for (const key of ["name", "description", "aliases", "facet"] as const) {
    if (!(key in op.set)) continue;
    const next = op.set[key];
    if (sameValue(tag[key], next)) continue;
    changes[key] = { from: tag[key], to: next };
    data[key] = next as never;
  }

  if ("parentCode" in op.set) {
    const nextParent = op.set.parentCode
      ? await db.query.tags.findFirst({
          where: eq(schema.tags.code, op.set.parentCode),
        })
      : null;
    if (op.set.parentCode && !nextParent) {
      throw new Error(`Parent tag not found: ${op.set.parentCode}`);
    }

    const nextParentId = nextParent?.id ?? null;
    if (tag.parentTagId !== nextParentId) {
      const currentParent = tag.parentTagId
        ? await db.query.tags.findFirst({
            where: eq(schema.tags.id, tag.parentTagId),
          })
        : null;
      changes.parentCode = {
        from: currentParent?.code ?? null,
        to: op.set.parentCode ?? null,
      };
      data.parentTagId = nextParentId;
    }
  }

  if (Object.keys(changes).length === 0) {
    return {
      index,
      op: op.op,
      target: op.code,
      status: "unchanged",
    };
  }

  await updateTagWithTaxonomy(db, tag.id, data);

  return {
    index,
    op: op.op,
    target: op.code,
    status: "updated",
    changes,
  };
}

async function addProjectTags(
  db: DB,
  op: z.infer<typeof addProjectTagsOperationSchema>,
  index: number,
): Promise<OperationResult> {
  const { project, requestedCodes, tags, tagByCode } = await resolveProjectTags(
    db,
    op,
  );

  const tagIds = tags.map(({ id }) => id);
  const existing = await db.query.projectsToTags.findMany({
    where: and(
      eq(schema.projectsToTags.projectId, project.id),
      inArray(schema.projectsToTags.tagId, tagIds),
    ),
  });
  const existingIds = new Set(existing.map(({ tagId }) => tagId));
  const addedCodes = requestedCodes.filter(
    (code) => !existingIds.has(tagByCode.get(code)?.id ?? ""),
  );

  if (addedCodes.length === 0) {
    return {
      index,
      op: op.op,
      target: op.project,
      status: "unchanged",
      tags: [],
    };
  }

  await db
    .insert(schema.projectsToTags)
    .values(
      addedCodes.map((code) => ({
        projectId: project.id,
        tagId: tagByCode.get(code)?.id ?? "",
      })),
    )
    .onConflictDoNothing();

  return {
    index,
    op: op.op,
    target: op.project,
    status: "added",
    tags: addedCodes,
  };
}

async function removeProjectTags(
  db: DB,
  op: z.infer<typeof removeProjectTagsOperationSchema>,
  index: number,
): Promise<OperationResult> {
  const { project, requestedCodes, tags, tagByCode } = await resolveProjectTags(
    db,
    op,
  );
  const tagIds = tags.map(({ id }) => id);
  const existing = await db.query.projectsToTags.findMany({
    where: and(
      eq(schema.projectsToTags.projectId, project.id),
      inArray(schema.projectsToTags.tagId, tagIds),
    ),
  });
  const existingIds = new Set(existing.map(({ tagId }) => tagId));
  const removedCodes = requestedCodes.filter((code) =>
    existingIds.has(tagByCode.get(code)?.id ?? ""),
  );

  if (removedCodes.length === 0) {
    return {
      index,
      op: op.op,
      target: op.project,
      status: "unchanged",
      tags: [],
    };
  }

  await db.delete(schema.projectsToTags).where(
    and(
      eq(schema.projectsToTags.projectId, project.id),
      inArray(
        schema.projectsToTags.tagId,
        removedCodes.map((code) => tagByCode.get(code)?.id ?? ""),
      ),
    ),
  );

  return {
    index,
    op: op.op,
    target: op.project,
    status: "removed",
    tags: removedCodes,
  };
}

async function resolveProjectTags(
  db: DB,
  op: { project: string; tags: string[] },
) {
  const project = await db.query.projects.findFirst({
    where: eq(schema.projects.slug, op.project),
  });
  if (!project) throw new Error(`Project not found: ${op.project}`);

  const requestedCodes = Array.from(new Set(op.tags));
  const tags = await db.query.tags.findMany({
    where: inArray(schema.tags.code, requestedCodes),
  });
  const tagByCode = new Map(tags.map((tag) => [tag.code, tag]));
  const missingCodes = requestedCodes.filter((code) => !tagByCode.has(code));
  if (missingCodes.length > 0) {
    throw new Error(`Tags not found: ${missingCodes.join(", ")}`);
  }

  return { project, requestedCodes, tags, tagByCode };
}

function sameValue(left: unknown, right: unknown) {
  return JSON.stringify(left) === JSON.stringify(right);
}
