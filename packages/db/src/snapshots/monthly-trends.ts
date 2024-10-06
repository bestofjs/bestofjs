import { normalizeDate, Snapshot, SnapshotMonth } from "./utils";

export function getMonthlyTrends(snapshots: Snapshot[], date: Date) {
  const months = getLast12Months(date);
  const trends = months
    .map((month) => ({
      ...month,
      delta: getMonthlyDelta(snapshots, month).delta,
    }))
    .filter((month) => month.delta !== undefined);
  return trends as (SnapshotMonth & { delta: number })[];
}

export function getLastSnapshotOfTheMonth(
  snapshots: Snapshot[],
  date: SnapshotMonth
): Snapshot | undefined {
  return lastElement(
    snapshots.filter((snapshot) => isSameMonth(snapshot, date))
  );
}

export function getMonthlyDelta(snapshots: Snapshot[], date: SnapshotMonth) {
  const firstSnapshot = getFirstSnapshotOfTheMonth(snapshots, date);

  const lastSnapshot = getFirstSnapshotOfTheMonth(
    snapshots,
    getNextMonth(date)
  );
  const delta =
    !lastSnapshot || !firstSnapshot
      ? undefined
      : lastSnapshot.stars - firstSnapshot.stars;
  const stars = lastSnapshot?.stars || undefined;
  return { delta, stars };
}

export function getFirstSnapshotOfTheMonth(
  snapshots: Snapshot[],
  date: SnapshotMonth
): Snapshot | undefined {
  return firstElement(
    snapshots.filter((snapshot) => isSameMonth(snapshot, date))
  );
}

export function getLast12Months(fromDate: Date): SnapshotMonth[] {
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

export function getPreviousMonth(date: SnapshotMonth): SnapshotMonth {
  const { year, month } = date;
  return month === 1
    ? { year: year - 1, month: 12 }
    : { year, month: month - 1 };
}

export function getNextMonth(date: SnapshotMonth): SnapshotMonth {
  const { year, month } = date;
  return month === 12
    ? { year: year + 1, month: 1 }
    : { year, month: month + 1 };
}

function isSameMonth(date1: SnapshotMonth, date2: SnapshotMonth) {
  return date1.year === date2.year && date1.month === date2.month;
}

function firstElement<T>(array: T[]) {
  return array.length ? array[0] : undefined;
}

function lastElement<T>(array: T[]) {
  return array.length ? array[array.length - 1] : undefined;
}
