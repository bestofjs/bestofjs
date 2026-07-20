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

/** Sort options for the trends-backed queries used by the public web app */
export const trendsSortKeySchema = z.enum([
  "trending",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "most-stars",
  "most-active",
  "most-used",
  "newest",
]);

export type TrendsSortKey = z.infer<typeof trendsSortKeySchema>;
