import { describe, expect, it } from "vitest";

import { type RankingEntry, resolveRankingProjects } from "./ranking-resolver";

describe("resolveRankingProjects", () => {
  it("preserves archive order, filters before limiting, and reports only DB misses", () => {
    const entries = [
      { slug: "first", full_name: "org/first", delta: 40 },
      { slug: "excluded", full_name: "org/excluded", delta: 30 },
      { slug: "third", full_name: "org/third", delta: 20 },
      { slug: "missing", full_name: "org/missing", delta: 10 },
    ] satisfies RankingEntry[];

    const result = resolveRankingProjects({
      entries,
      // Deliberately unordered, as a SQL IN query has no input-list ordering.
      foundProjects: [
        { slug: "third", name: "Third" },
        { slug: "first", name: "First" },
      ],
      limit: 2,
      // `excluded` exists in the DB but was removed by deployment tag filters.
      missingSlugs: ["missing"],
    });

    expect(result.projects).toEqual([
      { slug: "first", name: "First", score: 40 },
      { slug: "third", name: "Third", score: 20 },
    ]);
    expect(result.missingEntries).toEqual([entries[3]]);
  });
});
