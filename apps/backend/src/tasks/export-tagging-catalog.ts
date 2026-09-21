import { z } from "zod";

import { PROJECT_STATUSES } from "@repo/core/constants";
import { TAG_FACETS, type TagFacet } from "@repo/core/services/tags/taxonomy";

export const TAGGING_CATALOG_SCHEMA_VERSION = 1;

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

export const taggingCatalogSchema = z
  .object({
    schemaVersion: z.literal(TAGGING_CATALOG_SCHEMA_VERSION),
    tags: z.array(catalogTagSchema),
    projects: z.array(catalogProjectSchema),
  })
  .strict();

export type TaggingCatalog = z.infer<typeof taggingCatalogSchema>;

export type CatalogTagSource = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  aliases: unknown;
  facet: TagFacet | null;
  parentTagId: string | null;
};

export type CatalogProjectSource = {
  id: string;
  slug: string;
  name: string;
  description: string;
  repositoryOwner: string;
  repositoryName: string;
  status: string;
};

export type DirectTagAssignment = {
  projectId: string;
  tagCode: string;
};

export function buildTaggingCatalog({
  tags,
  projects,
  directTagAssignments,
}: {
  tags: CatalogTagSource[];
  projects: CatalogProjectSource[];
  directTagAssignments: DirectTagAssignment[];
}): TaggingCatalog {
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

  const catalog = {
    schemaVersion: TAGGING_CATALOG_SCHEMA_VERSION,
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
  };

  return taggingCatalogSchema.parse(catalog);
}

export function serializeTaggingCatalog(catalog: TaggingCatalog) {
  return `${JSON.stringify(taggingCatalogSchema.parse(catalog), null, 2)}\n`;
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
