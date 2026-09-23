import type { DB } from "../..";
import { beforeAll, describe, expect, it } from "bun:test";

type ChangePlanModule = typeof import("./change-plan");

let runTaggingPlan: ChangePlanModule["runTaggingPlan"];
let taggingPlanSchema: ChangePlanModule["taggingPlanSchema"];

beforeAll(async () => {
  process.env.POSTGRES_URL ??= "postgresql://test:test@localhost:5432/test";
  ({ runTaggingPlan, taggingPlanSchema } = await import("./change-plan"));
});

describe("taggingPlanSchema", () => {
  it("rejects invalid project slugs and tag codes", () => {
    const invalidPlans = [
      {
        op: "update-tag",
        code: "SSE",
        set: { name: "Server-sent events" },
      },
      {
        op: "update-tag",
        code: "sse",
        set: { parentCode: "node.js" },
      },
      {
        op: "add-project-tags",
        project: "Pongo",
        tags: ["database"],
      },
      {
        op: "remove-project-tags",
        project: "pongo",
        tags: ["node.js"],
      },
    ];

    for (const op of invalidPlans) {
      expect(
        taggingPlanSchema.safeParse({
          ops: [op],
        }).success,
      ).toBe(false);
    }
  });
});

describe("runTaggingPlan", () => {
  it("leaves matching tag fields unchanged", async () => {
    const db = {
      query: {
        tags: {
          findFirst: async () => ({
            id: "tag-1",
            code: "optic",
            name: "Optic",
            description: null,
            aliases: null,
            facet: "ecosystem",
            parentTagId: null,
          }),
        },
      },
    } as unknown as DB;

    const result = await runTaggingPlan(
      { db },
      {
        schemaVersion: 1,
        ops: [
          {
            op: "update-tag",
            code: "optic",
            set: { facet: "ecosystem" },
          },
        ],
      },
    );

    expect(result).toEqual({
      summary: { changed: 0, unchanged: 1 },
      ops: [
        {
          index: 0,
          op: "update-tag",
          target: "optic",
          status: "unchanged",
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
      { db },
      {
        schemaVersion: 1,
        ops: [
          {
            op: "add-project-tags",
            project: "optic",
            tags: ["web-development", "typescript", "typescript"],
          },
        ],
      },
    );

    expect(inserted).toEqual([{ projectId: "project-1", tagId: "tag-2" }]);
    expect(result.ops[0]).toMatchObject({
      status: "added",
      tags: ["typescript"],
    });
  });

  it("removes only assigned project tags and is idempotent", async () => {
    let assignedTagIds = ["tag-1"];
    let deletionCount = 0;
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
          findMany: async () =>
            assignedTagIds.map((tagId) => ({
              projectId: "project-1",
              tagId,
            })),
        },
      },
      delete: () => ({
        async where() {
          deletionCount++;
          assignedTagIds = [];
        },
      }),
    } as unknown as DB;
    const plan = {
      schemaVersion: 1 as const,
      ops: [
        {
          op: "remove-project-tags" as const,
          project: "optic",
          tags: ["web-development", "typescript", "web-development"],
        },
      ],
    };

    const firstResult = await runTaggingPlan({ db }, plan);
    const secondResult = await runTaggingPlan({ db }, plan);

    expect(deletionCount).toBe(1);
    expect(firstResult.ops[0]).toMatchObject({
      status: "removed",
      tags: ["web-development"],
    });
    expect(secondResult.ops[0]).toMatchObject({
      status: "unchanged",
      tags: [],
    });
  });

  it("keeps completed ops when a later op fails", async () => {
    const inserted: unknown[] = [];
    let projectLookupCount = 0;
    const db = {
      query: {
        projects: {
          findFirst: async () =>
            projectLookupCount++ === 0
              ? { id: "project-1", slug: "optic" }
              : undefined,
        },
        tags: {
          findMany: async () => [{ id: "tag-1", code: "typescript" }],
        },
        projectsToTags: {
          findMany: async () => [],
        },
      },
      insert: () => ({
        values(values: unknown[]) {
          inserted.push(...values);
          return { onConflictDoNothing: async () => undefined };
        },
      }),
    } as unknown as DB;

    const result = runTaggingPlan(
      { db },
      {
        schemaVersion: 1,
        ops: [
          {
            op: "add-project-tags",
            project: "optic",
            tags: ["typescript"],
          },
          {
            op: "add-project-tags",
            project: "missing",
            tags: ["typescript"],
          },
        ],
      },
    );

    await expect(result).rejects.toThrow("Project not found: missing");
    expect(inserted).toEqual([{ projectId: "project-1", tagId: "tag-1" }]);
  });
});
