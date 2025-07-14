import { fetchMonthlyDownloads } from "./monthly-downloads";
import { describe, expect, test } from "bun:test";

describe("Monthly downloads", async () => {
  test("Fetch monthly downloads", async () => {
    const results = await fetchMonthlyDownloads("express");

    expect(results).toBeInstanceOf(Array);

    const lastResult = results.at(-1);
    expect(lastResult).toHaveProperty("year");
    expect(lastResult).toHaveProperty("month");
    expect(lastResult).toHaveProperty("downloads");

    const today = new Date();
    expect(lastResult?.year).toBe(today.getFullYear());
    expect(lastResult?.month).toBe(today.getMonth()); // previous month
    expect(lastResult?.downloads).toBeGreaterThan(100e6);
  });
});
