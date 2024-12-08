import invariant from "tiny-invariant";

import { Snapshot } from "./types";

/**
 * Return the variations of stars for different periods: one day, one week , one month...
 * Requirement: snapshots should be sorted by year in ascending order
 */
export function computeTrends(snapshots: Snapshot[], referenceDate?: Date) {
  if (snapshots.length === 0)
    return {
      daily: undefined,
      weekly: undefined,
      monthly: undefined,
      quarterly: undefined,
      yearly: undefined,
    };
  snapshots.reverse();
  const referenceSnapshot = referenceDate
    ? snapshots.find((snapshot) => toDate(snapshot) < referenceDate) // for the Rising Stars trends are computed based on a given reference date
    : snapshots[0]; // the most recent snapshot is the reference of the daily build process
  invariant(referenceSnapshot, "Reference snapshot not found");

  const findSnapshotDaysAgo = (days: number, exactMatch?: boolean) =>
    exactMatch
      ? snapshots.find(
          (snapshot) => diffDay(referenceSnapshot, snapshot) === days
        )
      : snapshots.find(
          (snapshot) => diffDay(referenceSnapshot, snapshot) >= days
        );

  const getDelta = (days: number, exactMatch?: boolean) => {
    if (snapshots.length < 2) return undefined;
    const snapshot = findSnapshotDaysAgo(days, exactMatch);
    if (!snapshot) return undefined;
    return referenceSnapshot.stars - snapshot.stars;
  };

  const getDailyDelta = () => {
    if (snapshots.length < 2) return undefined;
    let snapshot = findSnapshotDaysAgo(1, true);
    if (snapshot) return referenceSnapshot.stars - snapshot.stars;
    snapshot = findSnapshotDaysAgo(2, true);
    if (snapshot)
      return Math.ceil((referenceSnapshot.stars - snapshot.stars) / 2);
    return undefined;
  };

  return {
    // for daily and weekly trends, we need to snapshots taken exactly 1 day and 7 days ago
    daily: getDailyDelta(),
    weekly: getDelta(7, true),
    // for other trends, we are less strict to handle situations where we don't have snapshots for all the days
    monthly: getDelta(30, false),
    quarterly: getDelta(90, false),
    yearly: getDelta(365, false),
  };
}

function diffDay(snapshot1: Snapshot, snapshot2: Snapshot) {
  const d1 = toDate(snapshot1);
  const d2 = toDate(snapshot2);

  return (d1.getTime() - d2.getTime()) / 1000 / 3600 / 24;
}

function toDate({ year, month, day }: Snapshot) {
  return new Date(year, month - 1, day);
}
