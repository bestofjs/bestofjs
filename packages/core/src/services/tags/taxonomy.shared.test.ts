import {
  buildTagClosure,
  expandUpward,
  isValidEdge,
  type TaxonomyTag,
  wouldCreateCycle,
} from "./taxonomy.shared";
import { describe, expect, it } from "bun:test";

describe("tag taxonomy", () => {
  it("accepts only the documented facet edges", () => {
    expect(isValidEdge("ecosystem", "ecosystem")).toBe(true);
    expect(isValidEdge("category", "capability")).toBe(true);
    expect(isValidEdge("category", "property")).toBe(true);
    expect(isValidEdge("capability", "capability")).toBe(false);
    expect(isValidEdge("property", "property")).toBe(false);
    expect(isValidEdge("ecosystem", "category")).toBe(false);
    expect(isValidEdge("category", "category")).toBe(false);
    expect(isValidEdge(null, "ecosystem")).toBe(false);
    expect(isValidEdge("ecosystem", null)).toBe(false);
  });

  it("detects self, direct and transitive cycles but allows clearing", () => {
    const tags = [
      { id: "react", parentTagId: null },
      { id: "next", parentTagId: "react" },
      { id: "meta", parentTagId: "next" },
    ];
    expect(wouldCreateCycle(tags, "react", "react")).toBe(true);
    expect(wouldCreateCycle(tags, "react", "next")).toBe(true);
    expect(wouldCreateCycle(tags, "react", "meta")).toBe(true);
    expect(wouldCreateCycle(tags, "meta", null)).toBe(false);
  });

  it("builds depth-zero and transitive closure rows", () => {
    const tags: TaxonomyTag[] = [
      { id: "react", facet: "ecosystem", parentTagId: null },
      { id: "next", facet: "ecosystem", parentTagId: "react" },
      { id: "meta", facet: "ecosystem", parentTagId: "next" },
    ];
    expect(buildTagClosure(tags)).toEqual([
      { descendantId: "react", ancestorId: "react", depth: 0 },
      { descendantId: "next", ancestorId: "next", depth: 0 },
      { descendantId: "next", ancestorId: "react", depth: 1 },
      { descendantId: "meta", ancestorId: "meta", depth: 0 },
      { descendantId: "meta", ancestorId: "next", depth: 1 },
      { descendantId: "meta", ancestorId: "react", depth: 2 },
    ]);
  });

  it("rejects invalid source state before deriving closure rows", () => {
    expect(() =>
      buildTagClosure([
        { id: "test", facet: "capability", parentTagId: null },
        { id: "automation", facet: "capability", parentTagId: "test" },
      ]),
    ).toThrow("Invalid taxonomy edge");
    expect(() =>
      buildTagClosure([
        { id: "a", facet: "ecosystem", parentTagId: "b" },
        { id: "b", facet: "ecosystem", parentTagId: "a" },
      ]),
    ).toThrow("Taxonomy cycle");
  });

  it("expands direct codes upward and collapses duplicates", () => {
    const parents = new Map<string, string | null>([
      ["react", null],
      ["next", "react"],
      ["meta", "next"],
    ]);
    expect(expandUpward(["meta", "next"], parents)).toEqual([
      "meta",
      "next",
      "react",
    ]);
  });
});
