import { and, eq } from "drizzle-orm";

import { db } from "..";
import { MonthSnapshots, OneYearSnapshots } from "../projects";
import * as schema from "../schema";

export async function getSnapshotRecord(repoId: string, year: number) {
  const snapshot = await db.query.snapshots.findFirst({
    where: and(
      eq(schema.snapshots.repoId, repoId),
      eq(schema.snapshots.year, year)
    ),
  });
  return snapshot as OneYearSnapshots | null;
}

export async function updateSnapshotRecord(
  repoId: string,
  year: number,
  months: MonthSnapshots[]
) {
  await db
    .update(schema.snapshots)
    .set({ months, updatedAt: new Date() })
    .where(
      and(eq(schema.snapshots.repoId, repoId), eq(schema.snapshots.year, year))
    );
}

export async function createSnapshotRecord(
  repoId: string,
  year: number,
  months: MonthSnapshots[]
) {
  const result = await db
    .insert(schema.snapshots)
    .values({ year, repoId, months })
    .returning();
  console.log("Snapshot record created", result);
}
