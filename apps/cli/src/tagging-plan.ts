import { z } from "zod";

import { TAG_FACETS } from "@repo/core/services/tags/taxonomy";

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

/**
 * Initial command schema. Move this interface to packages/core when the
 * database-backed tagging-plan module is implemented.
 */
export const taggingPlanSchema = z.object({
  schemaVersion: z.literal(1),
  operations: z.array(
    z.discriminatedUnion("operation", [
      updateTagOperationSchema,
      addProjectTagsOperationSchema,
    ]),
  ),
});

export type TaggingPlan = z.infer<typeof taggingPlanSchema>;

export const EMPTY_TAGGING_PLAN: TaggingPlan = {
  schemaVersion: 1,
  operations: [],
};
