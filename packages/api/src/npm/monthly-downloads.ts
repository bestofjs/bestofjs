import { format, subDays, subYears } from "date-fns";
import debugModule from "debug";
import { groupBy, mapValues, sumBy } from "es-toolkit";

const debug = debugModule("api");

type DownloadInput = {
  downloads: number;
  day: string; // yyyy-MM-dd format
};
type DownloadOutput = {
  downloads: number;
  year: number;
  month: number;
};

export async function fetchMonthlyDownloads(packageName: string) {
  const today = new Date();
  const { startDate, endDate } = getIntervalDates(today);

  const rangeParam = `${formatDateTime(startDate)}:${formatDateTime(endDate)}`;

  const data = await fetchDataFromNPM(packageName, rangeParam);

  const byMonth = groupByMonth(data.downloads);
  debug(byMonth);
  return byMonth;
}

async function fetchDataFromNPM(packageName: string, rangeParam: string) {
  const url = `https://api.npmjs.org/downloads/range/${rangeParam}/${packageName}`;
  debug("Fetch downloads for the range", rangeParam);
  const data = await fetch(url).then((res) => res.json());
  return data;
}

function getIntervalDates(date: Date) {
  const dt = new Date(date.getFullYear(), date.getMonth(), 1);

  const startDate = subYears(dt, 1);
  const endDate = subDays(dt, 1);

  return {
    startDate,
    endDate,
  };
}

function formatDateTime(dt: Date) {
  return format(dt, "yyyy-MM-dd");
}

function groupByMonth(downloadData: DownloadInput[]): DownloadOutput[] {
  const byMonth = groupBy(downloadData, ({ day }) => {
    const monthKey = day.slice(0, 7);
    return monthKey;
  });

  const totalsByMonth = mapValues(byMonth, (value) => {
    return sumBy(value, (item) => item.downloads);
  });

  const results = Object.keys(totalsByMonth).map((key) => ({
    year: parseInt(key.slice(0, 4)),
    month: parseInt(key.slice(5, 7)),
    downloads: totalsByMonth[key],
  }));

  return results;
}
