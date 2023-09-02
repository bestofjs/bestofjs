import { MonthlyDate } from "./monthly-rankings-data";

export function formatMonthlyDate(date: MonthlyDate) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[date.month - 1] + " " + date.year.toString();
}
