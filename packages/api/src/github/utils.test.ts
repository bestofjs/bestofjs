import { parseLastPageFromLinkHeader } from "./utils";
import { describe, expect, test } from "bun:test";

describe("parseLastPageFromLinkHeader", () => {
  test("returns undefined for null", () => {
    expect(parseLastPageFromLinkHeader(null)).toBeUndefined();
  });

  test("returns undefined for empty string", () => {
    expect(parseLastPageFromLinkHeader("")).toBeUndefined();
  });

  test("returns undefined when there is no rel last", () => {
    const link =
      '<https://api.github.com/repositories/123/contributors?per_page=1&page=2>; rel="next"';
    expect(parseLastPageFromLinkHeader(link)).toBeUndefined();
  });

  test("parses single rel last link", () => {
    const link =
      '<https://api.github.com/repositories/123/contributors?per_page=1&page=347>; rel="last"';
    expect(parseLastPageFromLinkHeader(link)).toBe(347);
  });

  test("parses rel last when next is also present (GitHub style)", () => {
    const link =
      '<https://api.github.com/repositories/123/contributors?per_page=1&page=2>; rel="next", ' +
      '<https://api.github.com/repositories/123/contributors?per_page=1&page=347>; rel="last"';
    expect(parseLastPageFromLinkHeader(link)).toBe(347);
  });

  test("does not throw when rel last URL is invalid", () => {
    const link = '<not-a-valid-absolute-url>; rel="last"';
    expect(parseLastPageFromLinkHeader(link)).toBeUndefined();
  });

  test("skips rel last segment with invalid URL and uses a later valid one", () => {
    const link =
      '<not-a-valid-absolute-url>; rel="last", ' +
      '<https://api.github.com/repositories/123/contributors?per_page=1&page=347>; rel="last"';
    expect(parseLastPageFromLinkHeader(link)).toBe(347);
  });
});
