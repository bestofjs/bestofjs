import { DateTime } from "luxon";

import { YearMonthDay } from "./types";

export function normalizeDate(date: Date): YearMonthDay {
  const dt = DateTime.fromJSDate(date).setZone("Asia/Tokyo");
  const year = dt.year;
  const month = dt.month;
  const day = dt.day;
  return { year, month, day };
}
