import { and, eq } from "drizzle-orm";

import { getDatabase } from "..";
import { MonthSnapshots, OneYearSnapshots } from "../projects";
import * as schema from "../schema";

export async function getSnapshotRecord(repoId: string, year: number) {
  const db = getDatabase();
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
  const db = getDatabase();
  const result = await db
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
  const db = getDatabase();
  const result = await db
    .insert(schema.snapshots)
    .values({ year, repoId, months });
  console.log("Snapshot created", result);
}
