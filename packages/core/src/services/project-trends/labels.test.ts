import { getProjectLabel } from "./labels";
import { describe, expect, test } from "bun:test";

/** A healthy project: recent commits, real star growth, nothing to flag. */
const healthy = {
  status: "active" as const,
  activityScore: 100,
  yearlyStars: 500,
};

describe("getProjectLabel", () => {
  test("a healthy project gets no label", () => {
    expect(getProjectLabel(healthy)).toBeNull();
  });

  test("deprecated wins over every computed signal", () => {
    expect(
      getProjectLabel({
        ...healthy,
        status: "deprecated",
        activityScore: -50,
        yearlyStars: 0,
      }),
    ).toBe("deprecated");
  });

  test("negative activity (over a year without a commit) → inactive", () => {
    expect(getProjectLabel({ ...healthy, activityScore: -28 })).toBe(
      "inactive",
    );
  });

  test("inactive outranks cold", () => {
    expect(
      getProjectLabel({ ...healthy, activityScore: -28, yearlyStars: 0 }),
    ).toBe("inactive");
  });

  test("fewer than 50 new stars in a year → cold", () => {
    expect(getProjectLabel({ ...healthy, yearlyStars: 49 })).toBe("cold");
    expect(getProjectLabel({ ...healthy, yearlyStars: 50 })).toBeNull();
  });

  test("retalk: no stars in a year, last commit 2 years ago → inactive", () => {
    expect(
      getProjectLabel({
        status: "active",
        activityScore: -28,
        yearlyStars: 0,
      }),
    ).toBe("inactive");
  });

  test("null scores produce no label", () => {
    expect(
      getProjectLabel({
        status: "active",
        activityScore: null,
        yearlyStars: null,
      }),
    ).toBeNull();
  });

  test("a project tracked under a year is not cold (no yearly delta yet)", () => {
    expect(getProjectLabel({ ...healthy, yearlyStars: undefined })).toBeNull();
  });
});
