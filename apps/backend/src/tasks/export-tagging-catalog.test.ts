import {
  buildTaggingCatalog,
  type CatalogProjectSource,
  type CatalogTagSource,
  type DirectTagAssignment,
  serializeTaggingCatalog,
  TAGGING_CATALOG_SCHEMA_VERSION,
  taggingCatalogSchema,
} from "./export-tagging-catalog";
import { describe, expect, it } from "bun:test";

const tags: CatalogTagSource[] = [
  {
    id: "react-id",
    code: "react",
    name: "React",
    description: "The React ecosystem",
    aliases: ["ReactJS", "React.js"],
    facet: "ecosystem",
    parentTagId: null,
  },
  {
    id: "nextjs-id",
    code: "nextjs",
    name: "Next.js",
    description: null,
    aliases: null,
    facet: "ecosystem",
    parentTagId: "react-id",
  },
];

const projects: CatalogProjectSource[] = [
  {
    id: "hidden-id",
    slug: "hidden-project",
    name: "Hidden Project",
    description: "Internal curation state",
    repositoryOwner: "example",
    repositoryName: "hidden-project",
    status: "hidden",
  },
  {
    id: "deprecated-id",
    slug: "deprecated-project",
    name: "Deprecated Project",
    description: "Still useful classification evidence",
    repositoryOwner: "example",
    repositoryName: "deprecated-project",
    status: "deprecated",
  },
  {
    id: "nextjs-project-id",
    slug: "nextjs",
    name: "Next.js",
    description: "The React framework for the web",
    repositoryOwner: "vercel",
    repositoryName: "next.js",
    status: "active",
  },
];

const directTagAssignments: DirectTagAssignment[] = [
  { projectId: "nextjs-project-id", tagCode: "nextjs" },
  { projectId: "deprecated-id", tagCode: "react" },
  { projectId: "hidden-id", tagCode: "react" },
];

describe("tagging catalog export", () => {
  it("is byte-for-byte deterministic regardless of source ordering", () => {
    const first = serializeTaggingCatalog(
      buildTaggingCatalog({ tags, projects, directTagAssignments }),
    );
    const second = serializeTaggingCatalog(
      buildTaggingCatalog({
        tags: [...tags].reverse(),
        projects: [...projects].reverse(),
        directTagAssignments: [...directTagAssignments].reverse(),
      }),
    );

    expect(second).toBe(first);
    expect(first.endsWith("\n")).toBe(true);
  });

  it("excludes hidden projects and includes deprecated projects", () => {
    const catalog = buildTaggingCatalog({
      tags,
      projects,
      directTagAssignments,
    });

    expect(catalog.projects.map((project) => project.slug)).toEqual([
      "deprecated-project",
      "nextjs",
    ]);
  });

  it("exports alphabetized direct tags without expanding ancestors", () => {
    const catalog = buildTaggingCatalog({
      tags,
      projects,
      directTagAssignments: [
        ...directTagAssignments,
        { projectId: "nextjs-project-id", tagCode: "alpha" },
        { projectId: "nextjs-project-id", tagCode: "nextjs" },
      ],
    });
    const nextjs = catalog.projects.find(
      (project) => project.slug === "nextjs",
    );

    expect(nextjs?.directTags).toEqual(["alpha", "nextjs"]);
    expect(nextjs?.directTags).not.toContain("react");
  });

  it("validates schema version 1 and rejects incompatible versions", () => {
    const catalog = buildTaggingCatalog({
      tags,
      projects,
      directTagAssignments,
    });

    expect(taggingCatalogSchema.parse(catalog).schemaVersion).toBe(
      TAGGING_CATALOG_SCHEMA_VERSION,
    );
    expect(() =>
      taggingCatalogSchema.parse({ ...catalog, schemaVersion: 2 }),
    ).toThrow();
  });
});
