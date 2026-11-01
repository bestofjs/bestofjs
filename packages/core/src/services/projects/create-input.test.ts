import {
  createProjectCliInputSchema,
  createProjectInputSchema,
  parseGitHubRepo,
} from "./create-input";
import { describe, expect, it } from "bun:test";

describe("parseGitHubRepo", () => {
  it("accepts owner/name and a GitHub URL with an optional slash or .git", () => {
    expect(parseGitHubRepo("colinhacks/zod")).toEqual({
      owner: "colinhacks",
      name: "zod",
    });
    expect(parseGitHubRepo("https://github.com/colinhacks/zod")).toEqual({
      owner: "colinhacks",
      name: "zod",
    });
    expect(parseGitHubRepo("https://github.com/colinhacks/zod/")).toEqual({
      owner: "colinhacks",
      name: "zod",
    });
    expect(parseGitHubRepo("https://github.com/colinhacks/zod.git")).toEqual({
      owner: "colinhacks",
      name: "zod",
    });
  });

  it("rejects other hosts and extra path segments", () => {
    expect(parseGitHubRepo("https://gitlab.com/acme/widgets")).toBeUndefined();
    expect(
      parseGitHubRepo("https://github.com/acme/widgets/tree/main"),
    ).toBeUndefined();
    expect(parseGitHubRepo("acme/widgets/extra")).toBeUndefined();
    expect(parseGitHubRepo("not a repo")).toBeUndefined();
  });
});

describe("createProjectInputSchema", () => {
  it("accepts a repo without a description", () => {
    expect(
      createProjectInputSchema.safeParse({ repo: "acme/widgets" }).success,
    ).toBe(true);
  });

  it("rejects an invalid slug, an unknown status, and duplicate lists", () => {
    expect(
      createProjectInputSchema.safeParse({
        repo: "acme/widgets",
        slug: "Widgets",
      }).success,
    ).toBe(false);
    expect(
      createProjectInputSchema.safeParse({
        repo: "acme/widgets",
        status: "archived",
      }).success,
    ).toBe(false);

    const packages = createProjectInputSchema.safeParse({
      repo: "acme/widgets",
      packages: ["widgets", "widgets"],
    });
    const tags = createProjectInputSchema.safeParse({
      repo: "acme/widgets",
      tags: ["react", "react"],
    });
    expect(packages.success).toBe(false);
    expect(tags.success).toBe(false);
    if (packages.success || tags.success) return;
    expect(packages.error.issues[0]?.message).toBe(
      "Duplicate package: widgets",
    );
    expect(tags.error.issues[0]?.message).toBe("Duplicate tag: react");
  });

  it("rejects package names that are not npm identities", () => {
    for (const packageName of ["react#anything", "react?foo=1", "React"]) {
      expect(
        createProjectInputSchema.safeParse({
          repo: "acme/widgets",
          packages: [packageName],
        }).success,
      ).toBe(false);
    }

    expect(
      createProjectInputSchema.safeParse({
        repo: "acme/widgets",
        packages: ["zod", "@acme/toolkit", "foo.js"],
      }).success,
    ).toBe(true);
  });
});

describe("createProjectCliInputSchema", () => {
  it("requires a description", () => {
    const missing = createProjectCliInputSchema.safeParse({
      repo: "acme/widgets",
    });
    const present = createProjectCliInputSchema.safeParse({
      repo: "acme/widgets",
      description: "A widget toolkit",
    });

    expect(missing.success).toBe(false);
    expect(present.success).toBe(true);
  });
});
