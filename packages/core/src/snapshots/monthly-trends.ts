import type { Snapshot, YearMonth } from "./types";
import { normalizeDate } from "./utils";

export function getMonthlyTrends(snapshots: Snapshot[], date: Date) {
  const months = getLast12Months(date);
  const trends = months
    .map((month) => ({
      ...month,
      delta: getMonthlyDelta(snapshots, month).delta,
    }))
    .filter((month) => month.delta !== undefined);
  return trends as (YearMonth & { delta: number })[];
}

export function getLastSnapshotOfTheMonth(
  snapshots: Snapshot[],
  date: YearMonth,
): Snapshot | undefined {
  return lastElement(
    snapshots.filter((snapshot) => isSameMonth(snapshot, date)),
  );
}

export function getMonthlyDelta(snapshots: Snapshot[], date: YearMonth) {
  const firstSnapshot = getFirstSnapshotOfTheMonth(snapshots, date);

  const lastSnapshot =
    getFirstSnapshotOfTheMonth(snapshots, getNextMonth(date)) ||
    getLastSnapshotOfTheMonth(snapshots, date); // fallback useful at the end of the year, when working on the 1st draft
  const delta =
    !lastSnapshot || !firstSnapshot
      ? undefined
      : lastSnapshot.stars - firstSnapshot.stars;
  const stars = lastSnapshot?.stars || undefined;

  return { delta, stars };
}

export function getFirstSnapshotOfTheMonth(
  snapshots: Snapshot[],
  date: YearMonth,
): Snapshot | undefined {
  return firstElement(
    snapshots.filter((snapshot) => isSameMonth(snapshot, date)),
  );
}

export function getLast12Months(fromDate: Date): YearMonth[] {
  const { year, month } = normalizeDate(fromDate);
  const finalMonth = getPreviousMonth({ year, month });
  const firstMonth = getNextMonth({
    year: finalMonth.year - 1,
    month: finalMonth.month,
  });

  let currentMonth = firstMonth;
  const months = [];
  for (let index = 0; index < 12; index++) {
    months.push(currentMonth);
    currentMonth = getNextMonth(currentMonth);
  }
  return months;
}

export function getPreviousMonth(date: YearMonth): YearMonth {
  const { year, month } = date;
  return month === 1
    ? { year: year - 1, month: 12 }
    : { year, month: month - 1 };
}

export function getNextMonth(date: YearMonth): YearMonth {
  const { year, month } = date;
  return month === 12
    ? { year: year + 1, month: 1 }
    : { year, month: month + 1 };
}

function isSameMonth(date1: YearMonth, date2: YearMonth) {
  return date1.year === date2.year && date1.month === date2.month;
}

function firstElement<T>(array: T[]) {
  return array.length ? array[0] : undefined;
}

function lastElement<T>(array: T[]) {
  return array.length ? array[array.length - 1] : undefined;
}
