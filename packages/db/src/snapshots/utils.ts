import { DateTime } from "luxon";

export type SnapshotMonth = {
  year: number;
  month: number;
};
export type SnapshotDay = SnapshotMonth & {
  day: number;
};
export type Snapshot = SnapshotDay & {
  stars: number;
};

export function normalizeDate(date: Date): SnapshotDay {
  const dt = DateTime.fromJSDate(date).setZone("Asia/Tokyo");
  const year = dt.year;
  const month = dt.month;
  const day = dt.day;
  return { year, month, day };
}
