import type { DB } from "../..";
import { beforeAll, describe, expect, it } from "bun:test";

type ChangePlanModule = typeof import("./change-plan");

let runTaggingPlan: ChangePlanModule["runTaggingPlan"];

beforeAll(async () => {
  process.env.POSTGRES_URL ??= "postgresql://test:test@localhost:5432/test";
  ({ runTaggingPlan } = await import("./change-plan"));
});

describe("runTaggingPlan", () => {
  it("reports tag field changes without writing in dry-run mode", async () => {
    const db = {
      query: {
        tags: {
          findFirst: async () => ({
            id: "tag-1",
            code: "optic",
            name: "Optic",
            description: null,
            aliases: null,
            facet: null,
            parentTagId: null,
          }),
        },
      },
    } as unknown as DB;

    const result = await runTaggingPlan(
      { db, dryRun: true },
      {
        schemaVersion: 1,
        operations: [
          {
            operation: "update-tag",
            code: "optic",
            set: { facet: "ecosystem" },
          },
        ],
      },
    );

    expect(result).toEqual({
      dryRun: true,
      summary: { changed: 1, unchanged: 0 },
      operations: [
        {
          index: 0,
          operation: "update-tag",
          target: "optic",
          status: "would-update",
          changes: { facet: { from: null, to: "ecosystem" } },
        },
      ],
    });
  });

  it("adds only project tags that are not already assigned", async () => {
    const inserted: unknown[] = [];
    const db = {
      query: {
        projects: {
          findFirst: async () => ({ id: "project-1", slug: "optic" }),
        },
        tags: {
          findMany: async () => [
            { id: "tag-1", code: "web-development" },
            { id: "tag-2", code: "typescript" },
          ],
        },
        projectsToTags: {
          findMany: async () => [{ projectId: "project-1", tagId: "tag-1" }],
        },
      },
      insert: () => ({
        values(values: unknown[]) {
          inserted.push(...values);
          return { onConflictDoNothing: async () => undefined };
        },
      }),
    } as unknown as DB;

    const result = await runTaggingPlan(
      { db, dryRun: false },
      {
        schemaVersion: 1,
        operations: [
          {
            operation: "add-project-tags",
            project: "optic",
            tags: ["web-development", "typescript", "typescript"],
          },
        ],
      },
    );

    expect(inserted).toEqual([{ projectId: "project-1", tagId: "tag-2" }]);
    expect(result.operations[0]).toMatchObject({
      status: "added",
      tags: ["typescript"],
    });
  });
});
