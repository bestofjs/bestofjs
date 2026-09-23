import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { object } from "@optique/core/constructs";
import { message } from "@optique/core/message";
import { defineCommand } from "@optique/discover/command";
import { z } from "zod";

import { schema, withDatabase } from "@repo/core";
import { PROJECT_STATUSES } from "@repo/core/constants";
import { eq } from "@repo/core/drizzle";
import { TAG_FACETS, type TagFacet } from "@repo/core/services/tags/taxonomy";

const catalogPath = resolve(
  import.meta.dir,
  "../../../../../docs/tagging/catalog.json",
);

const catalogTagSchema = z
  .object({
    code: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    aliases: z.array(z.string()).optional(),
    facet: z.enum(TAG_FACETS).nullable(),
    parentCode: z.string().nullable(),
  })
  .strict();

const catalogProjectSchema = z
  .object({
    slug: z.string(),
    name: z.string(),
    description: z.string(),
    repository: z.string(),
    status: z.enum(PROJECT_STATUSES),
    directTags: z.array(z.string()),
  })
  .strict();

const taggingCatalogSchema = z
  .object({
    schemaVersion: z.literal(1),
    tags: z.array(catalogTagSchema),
    projects: z.array(catalogProjectSchema),
  })
  .strict();

type CatalogTagSource = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  aliases: unknown;
  facet: TagFacet | null;
  parentTagId: string | null;
};

type CatalogProjectSource = {
  id: string;
  slug: string;
  name: string;
  description: string;
  repositoryOwner: string;
  repositoryName: string;
  status: string;
};

export default defineCommand({
  parser: object({}),
  metadata: {
    brief: message`Write the generated tagging catalog.`,
    description: message`Export the deterministic, agent-readable tagging catalog from the database.`,
  },
  async handler() {
    try {
      const catalog = await withDatabase(async (db) => {
        const [tags, projects, directTagAssignments] = await Promise.all([
          db
            .select({
              id: schema.tags.id,
              code: schema.tags.code,
              name: schema.tags.name,
              description: schema.tags.description,
              aliases: schema.tags.aliases,
              facet: schema.tags.facet,
              parentTagId: schema.tags.parentTagId,
            })
            .from(schema.tags),
          db
            .select({
              id: schema.projects.id,
              slug: schema.projects.slug,
              name: schema.projects.name,
              description: schema.projects.description,
              repositoryOwner: schema.repos.owner,
              repositoryName: schema.repos.name,
              status: schema.projects.status,
            })
            .from(schema.projects)
            .innerJoin(
              schema.repos,
              eq(schema.projects.repoId, schema.repos.id),
            ),
          db
            .select({
              projectId: schema.projectsToTags.projectId,
              tagCode: schema.tags.code,
            })
            .from(schema.projectsToTags)
            .innerJoin(
              schema.tags,
              eq(schema.projectsToTags.tagId, schema.tags.id),
            ),
        ]);

        return buildTaggingCatalog({ tags, projects, directTagAssignments });
      });
      const contents = `${JSON.stringify(catalog, null, 2)}\n`;
      await writeFile(catalogPath, contents);
      process.stdout.write(
        `${JSON.stringify(
          {
            status: "exported",
            command: "tagging export-catalog",
            path: catalogPath,
            tags: catalog.tags.length,
            projects: catalog.projects.length,
            bytes: Buffer.byteLength(contents),
          },
          null,
          2,
        )}\n`,
      );
    } catch (error) {
      process.stderr.write(
        `${JSON.stringify({
          status: "error",
          command: "tagging export-catalog",
          error: error instanceof Error ? error.message : String(error),
        })}\n`,
      );
      process.exitCode = 1;
    }
  },
});

function buildTaggingCatalog({
  tags,
  projects,
  directTagAssignments,
}: {
  tags: CatalogTagSource[];
  projects: CatalogProjectSource[];
  directTagAssignments: { projectId: string; tagCode: string }[];
}) {
  const tagCodeById = new Map(tags.map((tag) => [tag.id, tag.code]));
  const directTagsByProjectId = new Map<string, Set<string>>();

  for (const assignment of directTagAssignments) {
    const projectTags = directTagsByProjectId.get(assignment.projectId);
    if (projectTags) {
      projectTags.add(assignment.tagCode);
    } else {
      directTagsByProjectId.set(
        assignment.projectId,
        new Set([assignment.tagCode]),
      );
    }
  }

  return taggingCatalogSchema.parse({
    schemaVersion: 1,
    tags: tags
      .map((tag) => {
        const aliases = parseAliases(tag.aliases);
        const parentCode = tag.parentTagId
          ? tagCodeById.get(tag.parentTagId)
          : null;
        if (tag.parentTagId && !parentCode) {
          throw new Error(
            `Tag ${tag.code} refers to missing parent ${tag.parentTagId}`,
          );
        }

        return {
          code: tag.code,
          name: tag.name,
          description: tag.description,
          ...(aliases.length > 0 && { aliases }),
          facet: tag.facet,
          parentCode,
        };
      })
      .sort((a, b) => compareStrings(a.code, b.code)),
    projects: projects
      .filter((project) => project.status !== "hidden")
      .map((project) => ({
        slug: project.slug,
        name: project.name,
        description: project.description,
        repository: `${project.repositoryOwner}/${project.repositoryName}`,
        status: project.status,
        directTags: Array.from(
          directTagsByProjectId.get(project.id) ?? [],
        ).sort(compareStrings),
      }))
      .sort((a, b) => compareStrings(a.slug, b.slug)),
  });
}

function parseAliases(value: unknown) {
  if (value === null || value === undefined) return [];
  return z.array(z.string()).parse(value).sort(compareStrings);
}

function compareStrings(a: string, b: string) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}
