/** Schemas shared between frontend and backend */

import { z } from "zod";

const PROJECT_SLUG_PATTERN = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;
const TAG_CODE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const PROJECT_SLUG_ERROR =
  "Use lowercase letters and numbers separated by single hyphens or dots";
const TAG_CODE_ERROR =
  "Use lowercase letters and numbers separated by single hyphens";

export function validateProjectSlug(value: string) {
  return PROJECT_SLUG_PATTERN.test(value.trim());
}

export function validateTagCode(value: string) {
  return TAG_CODE_PATTERN.test(value.trim());
}

export const projectSlugSchema = z
  .string()
  .trim()
  .refine(validateProjectSlug, PROJECT_SLUG_ERROR);

export const tagCodeSchema = z
  .string()
  .trim()
  .refine(validateTagCode, TAG_CODE_ERROR);

export function generateDefaultSlug(name: string) {
  const slug = normalizeIdentifier(name, true);
  if (!validateProjectSlug(slug)) {
    throw new Error(`Cannot generate a project slug from "${name}"`);
  }
  return slug;
}

export function generateDefaultTagCode(name: string) {
  const code = normalizeIdentifier(name, false);
  if (!validateTagCode(code)) {
    throw new Error(`Cannot generate a tag code from "${name}"`);
  }
  return code;
}

function normalizeIdentifier(value: string, allowDots: boolean) {
  let normalized = value
    .trim()
    .toLowerCase()
    .replace(/^@/, "")
    .replace(/[\s_/]+/g, "-");

  if (!allowDots) normalized = normalized.replace(/\.+/g, "-");

  normalized = normalized.replace(/[^a-z0-9.-]/g, "");
  normalized = allowDots
    ? normalized.replace(/[.-]+/g, (separators) => separators.charAt(0))
    : normalized.replace(/-+/g, "-");

  return normalized.replace(/^[.-]+|[.-]+$/g, "");
}

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
  "last-commit",
  "contributors",
  "monthly-downloads",
  "created",
  "newest",
]);

export type TrendsSortKey = z.infer<typeof trendsSortKeySchema>;
