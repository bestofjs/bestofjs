import { describe, expect, it } from "vitest";

import { filterProjectsByQuery, filterTagsByQuery } from "./search-utils";

const projects = [
  {
    description: "A library for building user interfaces",
    full_name: "facebook/react",
    logo: "react.svg",
    name: "React",
    npm: "react",
    owner_id: 1,
    slug: "react",
    stars: 200_000,
    tags: ["ui-framework"],
    url: "https://react.dev",
  },
  {
    description: "A predictable state container",
    full_name: "reduxjs/redux",
    logo: "redux.svg",
    name: "Redux",
    npm: "redux",
    owner_id: 2,
    slug: "redux",
    stars: 60_000,
    tags: ["state-management"],
    url: "https://redux.js.org",
  },
] satisfies BestOfJS.SearchIndexProject[];

const tags = [
  {
    code: "react",
    counter: 1,
    description: "React ecosystem",
    name: "React",
  },
  {
    code: "webrtc",
    counter: 1,
    description: "Real-time communication",
    name: "WebRTC",
  },
] satisfies BestOfJS.Tag[];

describe("search-utils", () => {
  it("should filter projects by query", () => {
    const testCases = [
      { query: "rea", expected: "React" },
      { query: "red", expected: "Redux" },
    ];
    testCases.forEach(({ query, expected }) => {
      const results = filterProjectsByQuery(projects, query);
      expect(results[0].name).toEqual(expected);
    });
  });

  it("should filter tags by query", () => {
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
