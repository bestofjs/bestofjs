import { OneYearSnapshots } from "~/projects";
import { describe, expect, test } from "bun:test";

import { mergeSnapshots } from "./snapshots";
import { Snapshot } from "./types";

const snapshots: OneYearSnapshots = {
  year: 2024,
  months: [
    {
      month: 11,
      snapshots: [
        { day: 1, stars: 100 },
        { day: 2, stars: 101 },
      ],
    },
    {
      month: 12,
      snapshots: [
        { day: 1, stars: 500 },
        { day: 2, stars: 501 },
      ],
    },
  ],
};

describe("Testing snapshot read/update logic", () => {
  test("It should merge data", () => {
    const toBeAdded: Snapshot[] = [
      { year: 2024, month: 1, day: 1, stars: 1 },
      { year: 2024, month: 12, day: 1, stars: 499 },
    ];
    const results = mergeSnapshots(snapshots, toBeAdded);
    expect(results).toEqual([
      {
        month: 1,
        snapshots: [{ day: 1, stars: 1 }],
      },
      {
        month: 11,
        snapshots: [
          { day: 1, stars: 100 },
          { day: 2, stars: 101 },
        ],
      },
      {
        month: 12,
        snapshots: [
          { day: 1, stars: 499 }, // overridden
          { day: 2, stars: 501 },
        ],
      },
    ]);
  });
});
