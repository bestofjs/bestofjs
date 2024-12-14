export type YearMonth = {
  year: number;
  month: number;
};
export type YearMonthDay = YearMonth & {
  day: number;
};
export type Snapshot = YearMonthDay & {
  stars: number;
};
