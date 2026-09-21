import { rebuildTagClosure } from "./closure";
import type { TagClosureRow, TaxonomyTag } from "./taxonomy.shared";
import { describe, expect, it } from "bun:test";

describe("rebuildTagClosure", () => {
  it("keeps every closure insert below PostgreSQL's parameter limit", async () => {
    const tags: TaxonomyTag[] = Array.from({ length: 209 }, (_, index) => ({
      id: `tag-${index}`,
      facet: "ecosystem",
      parentTagId: index === 0 ? null : `tag-${index - 1}`,
    }));
    const insertedBatches: TagClosureRow[][] = [];
    const database = {
      select: () => ({ from: async () => tags }),
      delete: async () => undefined,
      insert: () => ({
        values: async (rows: TagClosureRow[]) => {
          insertedBatches.push(rows);
        },
      }),
    } as unknown as Parameters<typeof rebuildTagClosure>[0];

    const closure = await rebuildTagClosure(database);

    expect(closure).toHaveLength(21_945);
    expect(insertedBatches.length).toBeGreaterThan(1);
    expect(insertedBatches.every((batch) => batch.length * 3 <= 65_535)).toBe(
      true,
    );
    expect(insertedBatches.flat()).toEqual(closure);
  });
});
