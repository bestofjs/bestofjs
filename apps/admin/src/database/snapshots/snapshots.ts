import debugPackage from "debug";
import { create } from "lodash";

import {
  createSnapshotRecord,
  getSnapshotRecord,
  updateSnapshotRecord,
} from "./crud";
import { normalizeDate } from "./utils";

const debug = debugPackage("snapshots");

export async function addSnapshot(
  repoId: string,
  stars: number,
  { year, month, day } = normalizeDate(new Date())
) {
  const existingRecord = await getSnapshotRecord(repoId, year);

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
    await updateSnapshotRecord(repoId, year, updatedMonths);
  } else {
    await createSnapshotRecord(repoId, year, [
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

const findByMonth =
  <T extends { month: number }>(month: number) =>
  (item: T) =>
    item.month === month;

const findByDay =
  <T extends { day: number }>(day: number) =>
  (item: T) =>
    item.day === day;
