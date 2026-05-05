import { computeActivityScore, computePopularityScore } from "./scoring";
import { describe, expect, test } from "bun:test";

describe("computePopularityScore", () => {
  test("viral profile is well above healthy", () => {
    const viral = computePopularityScore({
      daily: 200,
      monthly: 2000,
      yearly: 15000,
    });
    const healthy = computePopularityScore({
      daily: 20,
      monthly: 300,
      yearly: 2000,
    });
    expect(viral).toBeGreaterThan(healthy);
    expect(viral).toBeGreaterThan(80);
  });

  test("healthy profile is positive and moderate", () => {
    const healthy = computePopularityScore({
      daily: 20,
      monthly: 300,
      yearly: 2000,
    });
    expect(healthy).toBeGreaterThan(50);
    expect(healthy).toBeLessThan(100);
  });

  test("stagnant profile is positive but small", () => {
    const stagnant = computePopularityScore({
      daily: 0,
      monthly: 10,
      yearly: 100,
    });
    expect(stagnant).toBeGreaterThan(0);
    expect(stagnant).toBeLessThan(50);
  });

  test("declining profile is negative", () => {
    const declining = computePopularityScore({
      daily: -5,
      monthly: -30,
      yearly: -100,
    });
    expect(declining).toBeLessThan(0);
  });

  test("zero deltas → zero score", () => {
    expect(computePopularityScore({})).toBe(0);
    expect(computePopularityScore({ daily: 0, monthly: 0, yearly: 0 })).toBe(0);
  });

  test("missing fields are treated as zero", () => {
    const a = computePopularityScore({ yearly: 1000 });
    const b = computePopularityScore({
      daily: 0,
      monthly: 0,
      yearly: 1000,
    });
    expect(a).toBeCloseTo(b, 6);
  });
});

describe("computeActivityScore", () => {
  const now = new Date("2026-05-05T12:00:00Z");

  const daysAgo = (days: number) =>
    new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  test("commit yesterday → near 100", () => {
    const score = computeActivityScore({
      lastCommit: daysAgo(1),
      contributors: 10,
      now,
    });
    expect(score).toBeGreaterThan(95);
    expect(score).toBeLessThanOrEqual(110);
  });

  test("commit 2 weeks ago → ~60-70", () => {
    const score = computeActivityScore({
      lastCommit: daysAgo(14),
      contributors: 5,
      now,
    });
    expect(score).toBeGreaterThan(60);
    expect(score).toBeLessThan(75);
  });

  test("commit 1 year ago → low (<25)", () => {
    const score = computeActivityScore({
      lastCommit: daysAgo(365),
      contributors: 3,
      now,
    });
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(25);
  });

  test("no commit date → 0", () => {
    expect(
      computeActivityScore({ lastCommit: null, contributors: 5, now }),
    ).toBe(0);
    expect(
      computeActivityScore({ lastCommit: undefined, contributors: 5, now }),
    ).toBe(0);
  });

  test("recent activity ranks above stale activity", () => {
    const recent = computeActivityScore({
      lastCommit: daysAgo(1),
      contributors: 5,
      now,
    });
    const stale = computeActivityScore({
      lastCommit: daysAgo(365),
      contributors: 5,
      now,
    });
    expect(recent).toBeGreaterThan(stale);
  });

  test("contributor bonus capped at 10", () => {
    const fewContributors = computeActivityScore({
      lastCommit: daysAgo(1),
      contributors: 2,
      now,
    });
    const manyContributors = computeActivityScore({
      lastCommit: daysAgo(1),
      contributors: 1000,
      now,
    });
    expect(manyContributors - fewContributors).toBeLessThanOrEqual(10);
  });

  test("contributors <= 1 yields no bonus", () => {
    const noContributors = computeActivityScore({
      lastCommit: daysAgo(1),
      contributors: 1,
      now,
    });
    const someContributors = computeActivityScore({
      lastCommit: daysAgo(1),
      contributors: 4,
      now,
    });
    expect(someContributors).toBeGreaterThan(noContributors);
  });

  test("future commit date does not produce negative days", () => {
    const future = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const score = computeActivityScore({
      lastCommit: future,
      contributors: 5,
      now,
    });
    expect(score).toBeGreaterThan(95);
  });
});
