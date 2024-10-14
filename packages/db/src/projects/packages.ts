import { and, eq } from "drizzle-orm";

import { db } from "..";
import * as schema from "../schema";

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
        eq(schema.packages.name, packageName)
      )
    );
}
