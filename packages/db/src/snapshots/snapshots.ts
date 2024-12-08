import debugPackage from "debug";
import { and, eq } from "drizzle-orm";
import { groupBy, orderBy, pick } from "es-toolkit";

import { DB } from "..";
import {
  flattenSnapshots,
  MonthSnapshots,
  OneYearSnapshots,
} from "../projects";
import * as schema from "../schema";
import { Snapshot } from "./types";
import { normalizeDate } from "./utils";

const debug = debugPackage("snapshots");

export class SnapshotsService {
  db: DB;
  constructor(db: DB) {
    this.db = db;
  }

  async getSnapshotRecord(repoId: string, year: number) {
    const snapshot = await this.db.query.snapshots.findFirst({
      where: and(
        eq(schema.snapshots.repoId, repoId),
        eq(schema.snapshots.year, year)
      ),
    });
    return snapshot as OneYearSnapshots | null;
  }

  async updateSnapshotRecord(
    repoId: string,
    year: number,
    months: MonthSnapshots[]
  ) {
    await this.db
      .update(schema.snapshots)
      .set({ months, updatedAt: new Date() })
      .where(
        and(
          eq(schema.snapshots.repoId, repoId),
          eq(schema.snapshots.year, year)
        )
      );
  }

  async createSnapshotRecord(
    repoId: string,
    year: number,
    months: MonthSnapshots[]
  ) {
    const result = await this.db
      .insert(schema.snapshots)
      .values({ year, repoId, months })
      .returning();
    debug("Snapshot created", result);
  }

  /** Add a snapshot for the current day, called every day for all active projects by the CRON job */
  async addSnapshot(
    repoId: string,
    stars: number,
    { year, month, day } = normalizeDate(new Date())
  ) {
    const existingRecord = await this.getSnapshotRecord(repoId, year);

    const currentMonths = existingRecord ? existingRecord.months : [];
    const monthItem = currentMonths.find(findByMonth(month));

    const existingSnapshot = monthItem?.snapshots.find(findByDay(day));
    if (existingSnapshot) {
      debug(
        `No snapshot to add, a snapshot already exists for this day (${day})`
      );
      return false;
    }

    if (existingRecord) {
      const updatedMonths = monthItem ? editMonth() : addMonth();
      await this.updateSnapshotRecord(repoId, year, updatedMonths);
    } else {
      await this.createSnapshotRecord(repoId, year, [
        { month, snapshots: [{ day, stars }] },
      ]);
    }

    return true;

    function addMonth() {
      return [...currentMonths, { month, snapshots: [{ day, stars }] }];
    }
    function editMonth() {
      return currentMonths.map((item) => {
        if (item.month === month) {
          return { ...item, snapshots: [...item.snapshots, { day, stars }] };
        }
        return item;
      });
    }
  }

  /** Add a bunch of snapshot data we got from GitHub API, useful for popular projects created during the year  */
  async addMissingSnapshotsForYear(
    repoId: string,
    year: number,
    snapshots: Snapshot[]
  ) {
    const existingRecord = await this.getSnapshotRecord(repoId, year);
    if (!existingRecord)
      throw new Error(`No snapshot record found for ${repoId} in ${year}`);
    const updatedMonths = mergeSnapshots(existingRecord, snapshots);
    await this.updateSnapshotRecord(repoId, year, updatedMonths);
  }
}

const findByMonth =
  <T extends { month: number }>(month: number) =>
  (item: T) =>
    item.month === month;

const findByDay =
  <T extends { day: number }>(day: number) =>
  (item: T) =>
    item.day === day;

export function mergeSnapshots(
  existingSnapshots: OneYearSnapshots,
  newSnapshots: Snapshot[]
) {
  const existingSnapshotsMap = buildKeyValueMap(
    flattenSnapshots([existingSnapshots])
  );
  const newSnapshotsMap = buildKeyValueMap(newSnapshots);

  const mergedMap = { ...existingSnapshotsMap, ...newSnapshotsMap };

  const months = unflattenKeyValueMap(mergedMap);
  return months;
}

type YearMonthDayKey = string;

function buildKeyValueMap(snapshots: Snapshot[]) {
  return snapshots.reduce(
    (acc, item) => {
      const key: YearMonthDayKey = `${item.year}-${item.month}-${item.day}`;
      acc[key] = item.stars;
      return acc;
    },
    {} as Record<YearMonthDayKey, number>
  );
}

function unflattenKeyValueMap(map: Record<YearMonthDayKey, number>) {
  const snapshots: Snapshot[] = orderSnapshots(
    Object.entries(map).map(([key, stars]) => {
      const [year, month, day] = key.split("-").map(Number);
      return { year, month, day, stars };
    })
  );
  const byMonth = groupBy(snapshots, (snapshot) => snapshot.month);

  const months = Object.entries(byMonth).map(([month, snapshots]) => ({
    month: Number(month),
    snapshots: snapshots.map((snapshot) => pick(snapshot, ["day", "stars"])),
  }));
  return months;
}

function orderSnapshots(snapshots: Snapshot[]) {
  return orderBy(
    snapshots,
    [(snapshot) => snapshot.month, (snapshot) => snapshot.day],
    ["asc", "asc"]
  );
}
