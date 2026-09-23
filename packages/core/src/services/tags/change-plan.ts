import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";

import type { DB } from "../..";
import * as schema from "../../schema";
import { TAG_FACETS } from "./taxonomy.shared";
import { type TagUpdateData, updateTagWithTaxonomy } from "./update";

const facetSchema = z.enum(TAG_FACETS);

const updateTagOperationSchema = z.object({
  operation: z.literal("update-tag"),
  code: z.string().trim().min(1),
  set: z
    .object({
      name: z.string().trim().min(1).optional(),
      description: z.string().nullable().optional(),
      aliases: z.array(z.string().trim().min(1)).nullable().optional(),
      facet: facetSchema.nullable().optional(),
      parentCode: z.string().trim().min(1).nullable().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one tag field must be supplied",
    }),
});

const addProjectTagsOperationSchema = z.object({
  operation: z.literal("add-project-tags"),
  project: z.string().trim().min(1),
  tags: z.array(z.string().trim().min(1)).min(1),
});

const removeProjectTagsOperationSchema = z.object({
  operation: z.literal("remove-project-tags"),
  project: z.string().trim().min(1),
  tags: z.array(z.string().trim().min(1)).min(1),
});

export const taggingPlanSchema = z.object({
  schemaVersion: z.literal(1),
  operations: z.array(
    z.discriminatedUnion("operation", [
      updateTagOperationSchema,
      addProjectTagsOperationSchema,
      removeProjectTagsOperationSchema,
    ]),
  ),
});

export type TaggingPlan = z.infer<typeof taggingPlanSchema>;

export const EMPTY_TAGGING_PLAN: TaggingPlan = {
  schemaVersion: 1,
  operations: [],
};

type OperationResult = {
  index: number;
  operation: TaggingPlan["operations"][number]["operation"];
  target: string;
  status: "added" | "removed" | "unchanged" | "updated";
  changes?: Record<string, { from: unknown; to: unknown }>;
  tags?: string[];
};

export async function runTaggingPlan({ db }: { db: DB }, plan: TaggingPlan) {
  const operations: OperationResult[] = [];

  for (let index = 0; index < plan.operations.length; index++) {
    const operation = plan.operations[index];
    switch (operation.operation) {
      case "update-tag":
        operations.push(await updateTag(db, operation, index));
        break;
      case "add-project-tags":
        operations.push(await addProjectTags(db, operation, index));
        break;
      case "remove-project-tags":
        operations.push(await removeProjectTags(db, operation, index));
        break;
    }
  }

  const unchanged = operations.filter(
    ({ status }) => status === "unchanged",
  ).length;

  return {
    summary: {
      changed: operations.length - unchanged,
      unchanged,
    },
    operations,
  };
}

async function updateTag(
  db: DB,
  operation: z.infer<typeof updateTagOperationSchema>,
  index: number,
): Promise<OperationResult> {
  const tag = await db.query.tags.findFirst({
    where: eq(schema.tags.code, operation.code),
  });
  if (!tag) throw new Error(`Tag not found: ${operation.code}`);

  const data: TagUpdateData = {};
  const changes: NonNullable<OperationResult["changes"]> = {};

  for (const key of ["name", "description", "aliases", "facet"] as const) {
    if (!(key in operation.set)) continue;
    const next = operation.set[key];
    if (sameValue(tag[key], next)) continue;
    changes[key] = { from: tag[key], to: next };
    data[key] = next as never;
  }

  if ("parentCode" in operation.set) {
    const nextParent = operation.set.parentCode
      ? await db.query.tags.findFirst({
          where: eq(schema.tags.code, operation.set.parentCode),
        })
      : null;
    if (operation.set.parentCode && !nextParent) {
      throw new Error(`Parent tag not found: ${operation.set.parentCode}`);
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
        to: operation.set.parentCode ?? null,
      };
      data.parentTagId = nextParentId;
    }
  }

  if (Object.keys(changes).length === 0) {
    return {
      index,
      operation: operation.operation,
      target: operation.code,
      status: "unchanged",
    };
  }

  await updateTagWithTaxonomy(db, tag.id, data);

  return {
    index,
    operation: operation.operation,
    target: operation.code,
    status: "updated",
    changes,
  };
}

async function addProjectTags(
  db: DB,
  operation: z.infer<typeof addProjectTagsOperationSchema>,
  index: number,
): Promise<OperationResult> {
  const { project, requestedCodes, tags, tagByCode } = await resolveProjectTags(
    db,
    operation,
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
      operation: operation.operation,
      target: operation.project,
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
    operation: operation.operation,
    target: operation.project,
    status: "added",
    tags: addedCodes,
  };
}

async function removeProjectTags(
  db: DB,
  operation: z.infer<typeof removeProjectTagsOperationSchema>,
  index: number,
): Promise<OperationResult> {
  const { project, requestedCodes, tags, tagByCode } = await resolveProjectTags(
    db,
    operation,
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
      operation: operation.operation,
      target: operation.project,
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
    operation: operation.operation,
    target: operation.project,
    status: "removed",
    tags: removedCodes,
  };
}

async function resolveProjectTags(
  db: DB,
  operation: { project: string; tags: string[] },
) {
  const project = await db.query.projects.findFirst({
    where: eq(schema.projects.slug, operation.project),
  });
  if (!project) throw new Error(`Project not found: ${operation.project}`);

  const requestedCodes = Array.from(new Set(operation.tags));
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
