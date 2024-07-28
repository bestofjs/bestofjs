import { and, eq } from "drizzle-orm";
import debugPackage from "debug";

import * as schema from "../schema";

import { normalizeDate } from "./utils";
import { DB } from "..";
import { MonthSnapshots, OneYearSnapshots } from "../projects";

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
      .values({ year, repoId, months });
    console.log("Snapshot created", result);
  }

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
}

const findByMonth =
  <T extends { month: number }>(month: number) =>
  (item: T) =>
    item.month === month;

const findByDay =
  <T extends { day: number }>(day: number) =>
  (item: T) =>
    item.day === day;
