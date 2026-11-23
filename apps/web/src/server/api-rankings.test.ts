import { afterEach, describe, expect, it, vi } from "vitest";

import { createRankingsAPI } from "./api-rankings";
import { type RankingEntry, resolveRankingProjects } from "./ranking-resolver";

vi.mock("@/app/projects/project-adapter", () => ({
  buildTagsByCode: vi.fn(),
  toTrendsProject: vi.fn(),
}));

describe("getMonthlyRankings", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("treats an upstream 404 as a missing archive without parsing its body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("Not found", { status: 404 })),
    );
    const findProjectsBySlugs = vi.fn();
    const findTags = vi.fn();
    const api = createRankingsAPI({ findProjectsBySlugs, findTags });

    await expect(
      api.getMonthlyRankings({ date: { year: 2019, month: 12 }, limit: 50 }),
    ).resolves.toBeNull();
    expect(findProjectsBySlugs).not.toHaveBeenCalled();
    expect(findTags).not.toHaveBeenCalled();
  });

  it("throws on other unsuccessful responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("Unavailable", { status: 503 })),
    );
    const api = createRankingsAPI({
      findProjectsBySlugs: vi.fn(),
      findTags: vi.fn(),
    });

    await expect(
      api.getMonthlyRankings({ date: { year: 2019, month: 12 }, limit: 50 }),
    ).rejects.toThrow("HTTP 503");
  });
});

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
