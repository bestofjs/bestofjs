/** Schemas shared between frontend and backend */

import { z } from "zod";

export const columnIdsSchema = z.enum([
  "name",
  "slug",
  "description",
  "status",
  "comments",
  "createdAt",
  "stars",
  "lastCommit",
  "commitCount",
]);

export const findProjectsSortSchema = z.array(
  z.object({ id: columnIdsSchema, desc: z.boolean() }),
);

export type ProjectsSortableColumnName = z.infer<typeof columnIdsSchema>;
