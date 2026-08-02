import { and, eq, inArray, isNotNull } from "drizzle-orm";

import { type DB, db } from "..";
import * as schema from "../schema";

/**
 * Maps npm package names to the slug of the project that owns them, for the
 * project detail page's dependency list: it has to tell "this dependency is on
 * Best of JS" from "it is not", and a project may own the name as a *secondary*
 * package, which `project_trends.package_name` does not record.
 *
 * Returns one row per matched package name, not per project — a project owning
 * two of the requested names appears twice, once under each name.
 */
export async function findProjectSlugsByPackageNames({
  db,
  packageNames,
}: {
  db: DB;
  packageNames: string[];
}) {
  if (packageNames.length === 0) return [];
  return await db
    .select({
      packageName: schema.packages.name,
      slug: schema.projects.slug,
    })
    .from(schema.packages)
    .innerJoin(
      schema.projects,
      eq(schema.projects.id, schema.packages.projectId),
    )
    .where(
      and(
        inArray(schema.packages.name, packageNames),
        isNotNull(schema.packages.projectId),
      ),
    );
}

export async function addPackage(projectId: string, packageName: string) {
  const values = {
    name: packageName,
    projectId,
  };
  await db.insert(schema.packages).values(values);
}

export async function removePackage(projectId: string, packageName: string) {
  await db
    .delete(schema.packages)
    .where(
      and(
        eq(schema.packages.projectId, projectId),
        eq(schema.packages.name, packageName),
      ),
    );
}
