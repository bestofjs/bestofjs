import {
  generateDefaultSlug,
  generateDefaultTagCode,
  projectSlugSchema,
  tagCodeSchema,
  validateProjectSlug,
  validateTagCode,
} from "./shared-schemas";
import { describe, expect, it } from "bun:test";

describe("project slugs", () => {
  it("validates and trims URL-safe project slugs", () => {
    expect(validateProjectSlug(" cal.com ")).toBe(true);
    expect(projectSlugSchema.parse(" trigger.dev ")).toBe("trigger.dev");

    for (const value of [
      "Pongo",
      "ran!",
      "foo--bar",
      "foo..bar",
      "@scope/name",
    ]) {
      expect(validateProjectSlug(value)).toBe(false);
    }
  });

  it("generates project slugs without losing valid dots", () => {
    expect(generateDefaultSlug("cal.com")).toBe("cal.com");
    expect(generateDefaultSlug("@scope/name")).toBe("scope-name");
    expect(generateDefaultSlug("RE:DOM")).toBe("redom");
    expect(generateDefaultSlug("Dojo-core (deprecated)")).toBe(
      "dojo-core-deprecated",
    );
    expect(generateDefaultSlug("foo_bar")).toBe("foo-bar");
  });

  it("rejects a name with no usable project slug characters", () => {
    expect(() => generateDefaultSlug("@!")).toThrow(
      'Cannot generate a project slug from "@!"',
    );
  });
});

describe("tag codes", () => {
  it("validates and trims URL-safe tag codes", () => {
    expect(validateTagCode(" web-development ")).toBe(true);
    expect(tagCodeSchema.parse(" node-js ")).toBe("node-js");

    for (const value of ["SSE", "node.js", "foo--bar", "@scope/name"]) {
      expect(validateTagCode(value)).toBe(false);
    }
  });

  it("generates tag codes with dots converted to hyphens", () => {
    expect(generateDefaultTagCode("Node.js")).toBe("node-js");
    expect(generateDefaultTagCode("@scope/name")).toBe("scope-name");
  });

  it("rejects a name with no usable tag code characters", () => {
    expect(() => generateDefaultTagCode("...")).toThrow(
      'Cannot generate a tag code from "..."',
    );
  });
});
