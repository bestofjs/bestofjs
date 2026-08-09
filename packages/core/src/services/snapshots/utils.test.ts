import { normalizeDate, toDate } from "./utils";
import { describe, expect, test } from "bun:test";

describe("Testing date utils", () => {
  test("It should normalize date", () => {
    const date = new Date("2024-12-14T00:00:00.000Z");
    const result = normalizeDate(date);
    expect(result).toEqual({ year: 2024, month: 12, day: 14 });
  });
  test("It should normalize date, shifting to the next day to take into account Japan Time Zone", () => {
    const date = new Date("2024-12-14T23:00:00.000Z");
    const result = normalizeDate(date);
    expect(result).toEqual({ year: 2024, month: 12, day: 15 });
  });

  test("It should transform snapshot to Date objects", () => {
    const date = { year: 2024, month: 12, day: 14 };
    const result = toDate(date);
    expect(result).toEqual(new Date("2024-12-13T15:00:00.000Z"));
  });
});
