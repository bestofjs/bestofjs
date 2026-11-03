import { nanoid } from "nanoid";

import { createGitHubClient } from "@repo/api/github";

import type { DB } from "../..";
import * as schema from "../../schema";
import { generateDefaultSlug } from "../../shared-schemas";
import {
  type CreateProjectInput,
  createProjectInputSchema,
  parseGitHubRepo,
} from "./create-input";

const MISSING_DESCRIPTION = "(No description)";

type CreateProjectOptions = {
  onProgress?: (message: string) => void;
};

type ExistingProject = {
  name: string;
  slug: string;
};

export type CreateProjectResult = {
  project: { id: string; slug: string; name: string };
  repo: { id: string; created: true };
  packages: string[];
  tags: string[];
};

export async function createProject(
  { db }: { db: DB },
  rawInput: CreateProjectInput,
  { onProgress }: CreateProjectOptions = {},
) {
  const input = createProjectInputSchema.parse(rawInput);
  const repoName = parseGitHubRepo(input.repo);
  if (!repoName) {
    throw new Error("Enter owner/name or a GitHub repository URL");
  }

  onProgress?.("Checking existing records");
  await assertRepoNotTracked(db, repoName.owner, repoName.name);

  const name = input.name;
  if (name) await assertNameAvailable(db, name);

  const slug = input.slug ?? (name ? generateDefaultSlug(name) : undefined);
  if (slug) await assertSlugAvailable(db, slug);

  const tagIds = await resolveTagIds(db, input.tags ?? []);
  const packageNames = input.packages ?? [];
  await assertPackagesUnlinked(db, packageNames);

  const github = await fetchGitHubRepo(
    db,
    repoName.owner,
    repoName.name,
    onProgress,
  );
  const resolvedName = name ?? github.name;
  if (!name) await assertNameAvailable(db, resolvedName);

  const resolvedSlug = slug ?? generateDefaultSlug(resolvedName);
  if (!slug) await assertSlugAvailable(db, resolvedSlug);

  if (packageNames.length > 0) {
    onProgress?.("Checking npm packages");
    await assertPackagesOnNpm(packageNames);
  }

  const providedDescription = input.description;
  const description =
    providedDescription || github.description.trim() || MISSING_DESCRIPTION;
  const providedUrl = input.url;
  const homepage = github.homepage?.trim() || null;

  onProgress?.("Creating project");
  const projectId = nanoid();
  const repoId = nanoid();
  const [project] = await db.transaction(async (tx) => {
    await tx.insert(schema.repos).values({
      id: repoId,
      archived: github.archived,
      default_branch: github.default_branch,
      description: github.description,
      homepage,
      name: github.name,
      owner: github.owner,
      owner_id: github.owner_id,
      stars: github.stargazers_count,
      topics: github.topics,
      pushed_at: github.pushed_at,
      created_at: github.created_at,
      license: github.license,
      last_commit: github.last_commit,
      commit_count: github.commit_count,
    });

    const created = await tx
      .insert(schema.projects)
      .values({
        id: projectId,
        repoId,
        name: resolvedName,
        slug: resolvedSlug,
        description,
        overrideDescription: providedDescription ? true : null,
        url: providedUrl ?? homepage,
        overrideURL: providedUrl ? true : null,
        status: input.status ?? "active",
        comments: input.comments?.trim() || null,
        packagePath: input.packagePath?.trim() || null,
      })
      .returning({
        id: schema.projects.id,
        slug: schema.projects.slug,
        name: schema.projects.name,
      });

    if (packageNames.length > 0) {
      await tx.insert(schema.packages).values(
        packageNames.map((packageName) => ({
          name: packageName,
          projectId,
        })),
      );
    }

    if (tagIds.length > 0) {
      await tx.insert(schema.projectsToTags).values(
        tagIds.map((tagId) => ({
          projectId,
          tagId,
        })),
      );
    }

    return created;
  });

  if (!project) throw new Error("Project insert returned no row");

  return {
    project,
    repo: { id: repoId, created: true },
    packages: packageNames,
    tags: input.tags ?? [],
  } satisfies CreateProjectResult;
}

async function assertRepoNotTracked(db: DB, owner: string, name: string) {
  const repo = await db.query.repos.findFirst({
    columns: { owner: true, name: true },
    with: {
      projects: { columns: { name: true, slug: true } },
    },
    where: (repos, { and, ilike }) =>
      and(
        ilike(repos.owner, escapeIlike(owner)),
        ilike(repos.name, escapeIlike(name)),
      ),
  });
  if (!repo) return;

  const fullName = `${repo.owner}/${repo.name}`;
  if (repo.projects.length === 0) {
    throw new Error(`Repo already tracked: ${fullName}`);
  }
  const labels = repo.projects
    .map((project) => `${project.name} (${project.slug})`)
    .join(", ");
  throw new Error(`Repo already tracked by ${labels}: ${fullName}`);
}

async function assertNameAvailable(db: DB, name: string) {
  const project = await findProject(db, "name", name);
  if (!project) return;
  throw new Error(`Name already used by ${project.name} (${project.slug})`);
}

async function assertSlugAvailable(db: DB, slug: string) {
  const project = await findProject(db, "slug", slug);
  if (!project) return;
  throw new Error(`Slug already used by ${project.name} (${project.slug})`);
}

async function findProject(
  db: DB,
  column: "name" | "slug",
  value: string,
): Promise<ExistingProject | undefined> {
  return await db.query.projects.findFirst({
    columns: { name: true, slug: true },
    where: (projects, { eq }) => eq(projects[column], value),
  });
}

async function resolveTagIds(db: DB, codes: string[]) {
  const tagIds: string[] = [];
  for (const code of codes) {
    const tag = await db.query.tags.findFirst({
      columns: { id: true },
      where: (tags, { eq }) => eq(tags.code, code),
    });
    if (!tag) throw new Error(`Tag not found: ${code}`);
    tagIds.push(tag.id);
  }
  return tagIds;
}

async function assertPackagesUnlinked(db: DB, packageNames: string[]) {
  for (const packageName of packageNames) {
    const existing = await db.query.packages.findFirst({
      columns: { name: true, projectId: true },
      where: (packages, { eq }) => eq(packages.name, packageName),
    });
    if (!existing) continue;

    const linkedProjectId = existing.projectId;
    if (!linkedProjectId) {
      throw new Error(
        `Package already linked to another project: ${packageName}`,
      );
    }

    const project = await db.query.projects.findFirst({
      columns: { name: true, slug: true },
      where: (projects, { eq }) => eq(projects.id, linkedProjectId),
    });
    const owner = project
      ? `${project.name} (${project.slug})`
      : "another project";
    throw new Error(`Package already linked to ${owner}: ${packageName}`);
  }
}

async function fetchGitHubRepo(
  db: DB,
  owner: string,
  name: string,
  onProgress?: (message: string) => void,
) {
  onProgress?.(`Fetching GitHub repository ${owner}/${name}`);
  const data = await createGitHubClient().fetchRepoInfo(`${owner}/${name}`);
  const sameRepo =
    data.owner.toLowerCase() === owner.toLowerCase() &&
    data.name.toLowerCase() === name.toLowerCase();
  if (!sameRepo) await assertRepoNotTracked(db, data.owner, data.name);
  return data;
}

async function assertPackagesOnNpm(packageNames: string[]) {
  for (const packageName of packageNames) {
    const response = await fetch(npmRegistryUrl(packageName));
    await response.body?.cancel();
    if (response.status === 404) {
      throw new Error(`Package not found on npm: ${packageName}`);
    }
    if (!response.ok) {
      throw new Error(
        `npm registry request failed for ${packageName} (${response.status})`,
      );
    }
  }
}

function npmRegistryUrl(packageName: string) {
  return `https://registry.npmjs.org/${encodeURIComponent(packageName)}`;
}

/** ILIKE treats `%`, `_`, and `\` as pattern characters. */
function escapeIlike(value: string) {
  return value.replace(/[\\%_]/g, (character) => `\\${character}`);
}
