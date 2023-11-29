import { describe, expect, it } from "vitest";

import { api } from "../server/api-local-json";
import { filterProjectsByQuery, filterTagsByQuery } from "./search-utils";

describe("search-utils", async () => {
  const projects = await api.projects.getSearchIndex();
  it("should filter projects by query", async () => {
    const testCases = [
      { query: "rea", expected: "React" },
      { query: "red", expected: "Redux" },
    ];
    testCases.forEach(({ query, expected }) => {
      const results = filterProjectsByQuery(projects, query);
      expect(results[0].name).toEqual(expected);
    });
  });

  it("should filter tags by query", async () => {
    const { tags } = await api.tags.findTags({
      sort: { counter: -1 },
      limit: 0, // grab all tags
    });
    const testCases = [
      { query: "rea", expected: "React" },
      { query: "RTC", expected: "WebRTC" },
    ];
    testCases.forEach(({ query, expected }) => {
      const results = filterTagsByQuery(tags, query);
      expect(results[0].name).toEqual(expected);
    });
  });
});
