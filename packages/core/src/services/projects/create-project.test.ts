import type { DB } from "../..";
import { createProject } from "./create-project";
import { describe, expect, it } from "bun:test";

type Project = { name: string; slug: string };
type Repo = { owner: string; name: string; projects: Project[] };

type Fixtures = {
  repos?: Repo[];
  names?: Record<string, Project>;
  slugs?: Record<string, Project>;
  projectsById?: Record<string, Project>;
  tags?: Record<string, { id: string }>;
  packages?: Record<string, { name: string; projectId: string | null }>;
};

describe("createProject", () => {
  it("rejects invalid input before querying the database", async () => {
    const db = rejectingDb();
    await expect(
      createProject(db, {
        repo: "acme/widgets",
        packages: ["widgets", "widgets"],
      }),
    ).rejects.toThrow("Duplicate package: widgets");
    await expect(
      createProject(db, { repo: "https://gitlab.com/acme/widgets" }),
    ).rejects.toThrow("Enter owner/name or a GitHub repository URL");
  });

  it("fails when the repo is already tracked, ignoring case", async () => {
    const db = fixtureDb({
      repos: [
        {
          owner: "some_org",
          name: "widgets",
          projects: [{ name: "Widgets", slug: "widgets" }],
        },
      ],
    });

    await expect(
      createProject(db, {
        repo: "SOME_ORG/widgets",
        name: "Other",
        slug: "other",
      }),
    ).rejects.toThrow(
      "Repo already tracked by Widgets (widgets): some_org/widgets",
    );
  });

  it("fails when the slug or name is already used", async () => {
    const slugDb = fixtureDb({
      slugs: { zod: { name: "Zod", slug: "zod" } },
    });
    const nameDb = fixtureDb({
      names: { Zod: { name: "Zod", slug: "zod" } },
    });

    await expect(
      createProject(slugDb, {
        repo: "acme/zod",
        name: "Zod",
        slug: "zod",
      }),
    ).rejects.toThrow("Slug already used by Zod (zod)");
    await expect(
      createProject(nameDb, {
        repo: "acme/zod",
        name: "Zod",
        slug: "other",
      }),
    ).rejects.toThrow("Name already used by Zod (zod)");
  });

  it("checks a generated slug before fetching GitHub", async () => {
    const db = fixtureDb({
      slugs: { zod: { name: "Zod", slug: "zod" } },
    });

    await expect(
      createProject(db, { repo: "acme/zod", name: "Zod" }),
    ).rejects.toThrow("Slug already used by Zod (zod)");
  });

  it("fails when a tag code does not exist", async () => {
    const db = fixtureDb({ tags: { validation: { id: "tag-1" } } });

    await expect(
      createProject(db, {
        repo: "acme/zod",
        name: "Zod",
        slug: "zod",
        tags: ["missing"],
      }),
    ).rejects.toThrow("Tag not found: missing");
  });

  it("fails when an npm package row already exists", async () => {
    const linked = fixtureDb({
      packages: {
        zod: { name: "zod", projectId: "project-1" },
      },
      projectsById: {
        "project-1": { name: "Zod", slug: "zod" },
      },
    });
    const unowned = fixtureDb({
      packages: {
        "left-pad": { name: "left-pad", projectId: null },
      },
    });

    await expect(
      createProject(linked, {
        repo: "acme/zod",
        name: "Zod",
        slug: "zod",
        packages: ["zod"],
      }),
    ).rejects.toThrow("Package already linked to Zod (zod): zod");
    await expect(
      createProject(unowned, {
        repo: "acme/left-pad",
        name: "Left Pad",
        slug: "left-pad",
        packages: ["left-pad"],
      }),
    ).rejects.toThrow("Package already linked to another project: left-pad");
  });
});

function fixtureDb(fixtures: Fixtures) {
  return {
    db: {
      query: {
        repos: {
          findFirst: async ({ where }: { where: Where }) => {
            const compared = comparisonsFrom(where);
            const owner = unescapeIlike(valueFor(compared, "owner"));
            const name = unescapeIlike(valueFor(compared, "name"));
            return (
              fixtures.repos?.find(
                (repo) =>
                  repo.owner.toLowerCase() === owner.toLowerCase() &&
                  repo.name.toLowerCase() === name.toLowerCase(),
              ) ?? null
            );
          },
        },
        projects: {
          findFirst: async ({ where }: { where: Where }) => {
            const comparison = comparisonsFrom(where)[0];
            if (!comparison) return null;
            if (comparison.column === "name") {
              return fixtures.names?.[comparison.value] ?? null;
            }
            if (comparison.column === "slug") {
              return fixtures.slugs?.[comparison.value] ?? null;
            }
            if (comparison.column === "id") {
              return fixtures.projectsById?.[comparison.value] ?? null;
            }
            return null;
          },
        },
        tags: {
          findFirst: async ({ where }: { where: Where }) => {
            const comparison = comparisonsFrom(where)[0];
            if (!comparison) return null;
            return fixtures.tags?.[comparison.value] ?? null;
          },
        },
        packages: {
          findFirst: async ({ where }: { where: Where }) => {
            const comparison = comparisonsFrom(where)[0];
            if (!comparison) return null;
            return fixtures.packages?.[comparison.value] ?? null;
          },
        },
      },
    } as unknown as DB,
  };
}

function rejectingDb() {
  const findFirst = async () => {
    throw new Error("DB should not be queried");
  };
  return {
    db: {
      query: {
        repos: { findFirst },
        projects: { findFirst },
        tags: { findFirst },
        packages: { findFirst },
      },
    } as unknown as DB,
  };
}

type Where = (
  table: Record<string, { name: string }>,
  operators: {
    eq: (column: { name: string }, value: string) => void;
    ilike: (column: { name: string }, value: string) => void;
    and: (...conditions: unknown[]) => void;
  },
) => void;

type Comparison = { column: string; value: string };

function comparisonsFrom(where: Where) {
  const comparisons: Comparison[] = [];
  const table = new Proxy(
    {},
    {
      get: (_target, property) => ({ name: String(property) }),
    },
  );
  where(table, {
    eq: (column, value) => {
      comparisons.push({ column: column.name, value });
    },
    ilike: (column, value) => {
      comparisons.push({ column: column.name, value });
    },
    and: () => undefined,
  });
  return comparisons;
}

function valueFor(comparisons: Comparison[], column: string) {
  return (
    comparisons.find((comparison) => comparison.column === column)?.value ?? ""
  );
}

function unescapeIlike(value: string) {
  return value.replace(/\\(.)/g, "$1");
}
