import { z } from "zod";

import { PROJECT_STATUSES } from "../../constants";
import { projectSlugSchema, tagCodeSchema } from "../../shared-schemas";

const REPO_SEGMENT = /^[A-Za-z0-9_.-]+$/;
const GITHUB_PREFIX = "https://github.com/";

const NPM_PACKAGE_NAME = /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/;

const optionalName = z.string().trim().min(1).optional();
const optionalDescription = z.string().trim().min(1).optional();
const optionalUrl = z.string().trim().min(1).optional();
const packageNameSchema = z
  .string()
  .trim()
  .max(214)
  .regex(NPM_PACKAGE_NAME, "Enter a valid npm package name");

const createProjectFields = {
  repo: z
    .string()
    .trim()
    .min(1)
    .refine(
      (value) => parseGitHubRepo(value) !== undefined,
      "Enter owner/name or a GitHub repository URL",
    ),
  name: optionalName,
  slug: projectSlugSchema.optional(),
  description: optionalDescription,
  url: optionalUrl,
  packages: z.array(packageNameSchema).optional(),
  packagePath: z.string().trim().optional(),
  tags: z.array(tagCodeSchema).optional(),
  status: z.enum(PROJECT_STATUSES).optional(),
  comments: z.string().trim().optional(),
};

export const createProjectInputSchema = z
  .object(createProjectFields)
  .superRefine(rejectDuplicateLists);

export const createProjectCliInputSchema = z
  .object({
    ...createProjectFields,
    description: z.string().trim().min(1, "Description is required"),
  })
  .superRefine(rejectDuplicateLists);

export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

/** `owner/name`, or `https://github.com/owner/name` with an optional slash or `.git`. */
export function parseGitHubRepo(input: string) {
  let value = input.trim();
  if (value.startsWith(GITHUB_PREFIX)) {
    value = value.slice(GITHUB_PREFIX.length);
  } else if (value.includes("://")) {
    return undefined;
  }

  if (value.endsWith("/")) value = value.slice(0, -1);
  if (value.toLowerCase().endsWith(".git")) value = value.slice(0, -4);

  const parts = value.split("/");
  if (parts.length !== 2) return undefined;

  const [owner, name] = parts;
  if (!owner || !name) return undefined;
  if (!REPO_SEGMENT.test(owner) || !REPO_SEGMENT.test(name)) return undefined;
  return { owner, name };
}

function rejectDuplicateLists(
  value: { packages?: string[]; tags?: string[] },
  ctx: z.RefinementCtx,
) {
  rejectDuplicates(value.packages, "package", "packages", ctx);
  rejectDuplicates(value.tags, "tag", "tags", ctx);
}

function rejectDuplicates(
  values: string[] | undefined,
  label: string,
  path: string,
  ctx: z.RefinementCtx,
) {
  if (!values) return;
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      ctx.addIssue({
        code: "custom",
        message: `Duplicate ${label}: ${value}`,
        path: [path],
      });
      return;
    }
    seen.add(value);
  }
}
