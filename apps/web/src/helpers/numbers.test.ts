import { describe, expect, it } from "vitest";

import { formatNumber } from "./numbers";

describe("Format numbers", () => {
  it("should format numbers in a compact way", () => {
    expect(formatNumber(120, "compact")).toBe("120");
    expect(formatNumber(1200, "compact")).toBe("1.2k");
    expect(formatNumber(1290, "compact")).toBe("1.29k");
    expect(formatNumber(5.99e6, "compact")).toBe("5.99M");
    expect(formatNumber(1.23e9, "compact")).toBe("1.23B");
  });
  it("should format numbers without truncating anything", () => {
    expect(formatNumber(1859, "full")).toBe("1,859");
  });
});
