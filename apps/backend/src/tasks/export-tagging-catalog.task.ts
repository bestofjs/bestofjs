import path from "node:path";
import fs from "fs-extra";

import { schema } from "@repo/core";
import { eq } from "@repo/core/drizzle";

import { createTask } from "@/task-runner";

import {
  buildTaggingCatalog,
  serializeTaggingCatalog,
} from "./export-tagging-catalog";

export const taggingCatalogPath = path.resolve(
  import.meta.dirname,
  "../../../../docs/tagging/catalog.json",
);

export const exportTaggingCatalogTask = createTask({
  name: "export-tagging-catalog",
  description:
    "Export the deterministic, agent-readable tagging catalog from the database.",
  run: async ({ db, dryRun, logger }) => {
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
        .innerJoin(schema.repos, eq(schema.projects.repoId, schema.repos.id)),
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

    const catalog = buildTaggingCatalog({
      tags,
      projects,
      directTagAssignments,
    });
    const contents = serializeTaggingCatalog(catalog);

    if (dryRun) {
      logger.info(`Dry run: would write ${taggingCatalogPath}`);
    } else {
      await fs.outputFile(taggingCatalogPath, contents);
      logger.info(`Wrote ${taggingCatalogPath}`);
    }

    return {
      data: null,
      meta: {
        tags: catalog.tags.length,
        projects: catalog.projects.length,
        bytes: Buffer.byteLength(contents),
        updated: !dryRun,
      },
    };
  },
});
