import { z } from "zod";

import { projectSlugSchema, tagCodeSchema } from "../../../shared-schemas";
import { TAG_FACETS } from "../taxonomy.shared";

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
