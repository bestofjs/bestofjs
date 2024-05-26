import { and, eq } from "drizzle-orm";

import * as schema from "@/database/schema";

import { getDatabase } from "..";
import { MonthSnapshots, OneYearSnapshots } from "../projects/get";

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

  // const result = await db
  //   .insert(schema.snapshots)
  //   .values({ year, months, repoId })
  //   .onConflictDoUpdate({
  //     target: [schema.snapshots.repoId, schema.snapshots.year],
  //     set: { months, updatedAt: new Date() },
  //   });

  console.log("Snapshot updated", result);
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
