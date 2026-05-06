import { computeRelevanceScore, computeUsageScore } from "./scoring";
import { describe, expect, test } from "bun:test";

describe("computeUsageScore", () => {
  test("anchor: 10M downloads → 100", () => {
    expect(computeUsageScore(10_000_000)).toBeCloseTo(100, 6);
  });

  test("anchor: 1M downloads → 80", () => {
    expect(computeUsageScore(1_000_000)).toBeCloseTo(80, 6);
  });

  test("anchor: 100k downloads → 60", () => {
    expect(computeUsageScore(100_000)).toBeCloseTo(60, 6);
  });

  test("anchor: 10k downloads → 40", () => {
    expect(computeUsageScore(10_000)).toBeCloseTo(40, 6);
  });

  test("clamps below 100 floor (no/zero downloads → 0)", () => {
    expect(computeUsageScore(undefined)).toBe(0);
    expect(computeUsageScore(null)).toBe(0);
    expect(computeUsageScore(0)).toBe(0);
    expect(computeUsageScore(50)).toBe(0); // below 100, clamped to 0
  });

  test("clamps above 10M ceiling (>10M → 100)", () => {
    expect(computeUsageScore(100_000_000)).toBe(100);
    expect(computeUsageScore(1_000_000_000)).toBe(100);
  });

  test("monotonic — more downloads ranks higher", () => {
    const a = computeUsageScore(50_000);
    const b = computeUsageScore(500_000);
    const c = computeUsageScore(5_000_000);
    expect(a).toBeLessThan(b);
    expect(b).toBeLessThan(c);
  });
});

describe("computeRelevanceScore", () => {
  test("with package: weighted 0.5 / 0.25 / 0.25", () => {
    const score = computeRelevanceScore({
      popularityScore: 100,
      activityScore: 100,
      usageScore: 100,
    });
    expect(score).toBeCloseTo(100, 6);
  });

  test("with package: arithmetic check", () => {
    // 80 * 0.5 + 60 * 0.25 + 40 * 0.25 = 40 + 15 + 10 = 65
    const score = computeRelevanceScore({
      popularityScore: 80,
      activityScore: 60,
      usageScore: 40,
    });
    expect(score).toBeCloseTo(65, 6);
  });

  test("no package: weighted 0.65 / 0.35", () => {
    // 80 * 0.65 + 60 * 0.35 = 52 + 21 = 73
    const score = computeRelevanceScore({
      popularityScore: 80,
      activityScore: 60,
    });
    expect(score).toBeCloseTo(73, 6);
  });

  test("deprecated malus is exactly -20", () => {
    const inputs = {
      popularityScore: 50,
      activityScore: 50,
      usageScore: 50,
    } as const;
    const active = computeRelevanceScore(inputs);
    const deprecated = computeRelevanceScore({ ...inputs, isDeprecated: true });
    expect(active - deprecated).toBeCloseTo(20, 6);
  });

  test("deprecated with strong NPM usage clears the floor (≥ 0)", () => {
    // 10M downloads → usage 100, no popularity/activity, deprecated
    const score = computeRelevanceScore({
      popularityScore: 0,
      activityScore: 0,
      usageScore: 100,
      isDeprecated: true,
    });
    expect(score).toBeGreaterThanOrEqual(0); // 0 + 0 + 25 - 20 = 5
  });

  test("deprecated with no signal falls below the floor", () => {
    const score = computeRelevanceScore({
      popularityScore: 0,
      activityScore: 0,
      usageScore: 0,
      isDeprecated: true,
    });
    expect(score).toBeLessThan(0);
  });

  test("usageScore=0 still counts as 'has package' (0 weight, not skipped)", () => {
    // hasPackage path: 80*0.5 + 60*0.25 + 0*0.25 = 40 + 15 = 55
    const withZero = computeRelevanceScore({
      popularityScore: 80,
      activityScore: 60,
      usageScore: 0,
    });
    // no-package path: 80*0.65 + 60*0.35 = 52 + 21 = 73
    const withoutPkg = computeRelevanceScore({
      popularityScore: 80,
      activityScore: 60,
    });
    expect(withZero).toBeCloseTo(55, 6);
    expect(withoutPkg).toBeCloseTo(73, 6);
    expect(withZero).toBeLessThan(withoutPkg);
  });
});
