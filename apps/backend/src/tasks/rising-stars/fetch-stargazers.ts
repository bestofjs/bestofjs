import NodeFetchCache, { FileSystemCache } from "node-fetch-cache";
import { Octokit } from "octokit";

import {
  normalizeDate,
  type Snapshot,
  type YearMonthDay,
} from "@repo/db/snapshots";

import { EventCounter } from "./utils";

const fetch = NodeFetchCache.create({
  shouldCacheResponse: (response) => response.ok,
  cache: new FileSystemCache({
    cacheDirectory: "./.cache",
    ttl: 12 * 60 * 60 * 1000, // 12 hours
  }),
});

const accessToken = process.env.GITHUB_ACCESS_TOKEN;
const octokit = new Octokit({ auth: accessToken, request: { fetch } });

type Event = YearMonthDay & { value: number };

export async function fetchAllStargazers(
  owner: string,
  repo: string,
  endDate: Date,
): Promise<Event[]> {
  console.log("> Fetch stargazers", owner, repo);
  const counter = new EventCounter<YearMonthDay>();

  const options = {
    owner,
    repo,
    per_page: 100,
    headers: {
      Accept: "application/vnd.github.v3.star+json",
    },
  };
  const iterator = octokit.paginate.iterator(
    octokit.rest.activity.listStargazersForRepo,
    options,
  );

  let page = 1;
  for await (const result of iterator) {
    console.log("Processing page", page);
    const data = result.data;
    page++;
    data.forEach((event) => {
      if (event.starred_at) {
        const date = normalizeDate(new Date(event.starred_at));
        counter.add(date);
      }
    });
    const lastEvent = data[data.length - 1];
    if (lastEvent.starred_at && new Date(lastEvent.starred_at) > endDate) {
      console.log("Stop fetching at", lastEvent.starred_at);
      break;
    }
  }
  const output = counter.toJSON();
  return output;
}

export function getFirstSnapshotsOfTheMonth(events: Event[], year: number) {
  if (!events.length) throw new Error("No events found");

  const allSnapshots = eventsToSnapshots(events);
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const firstSnapshotsOfTheMonth = months.map((month) => {
    const snapshot = findClosestSnapshotBeforeDate(allSnapshots, {
      year,
      month,
      day: 1,
    });

    const stars = snapshot?.stars || 0;
    return { year, month, day: 1, stars };
  });
  return firstSnapshotsOfTheMonth;
}

function findClosestSnapshotBeforeDate(
  snapshots: Snapshot[],
  date: YearMonthDay,
): Snapshot | undefined {
  const index = snapshots.findIndex(
    (snapshot) => compareDates(snapshot, date) > -1,
  );
  if (index === -1) return undefined; // No snapshot before

  let snapshot = snapshots[index];

  if (compareDates(snapshot, date) === 0) return snapshot;

  if (index === 1) return undefined;
  snapshot = snapshots[index - 1];
  return snapshot;
}

function eventsToSnapshots(events: Event[]): Snapshot[] {
  return events.reduce((acc, item) => {
    const { year, month, day, value } = item;
    const previousTotal = acc[acc.length - 1]?.stars | 0;
    const stars = previousTotal + value;
    // biome-ignore lint/performance/noAccumulatingSpread: TODO mutate the array instead?
    return [...acc, { year, month, day, stars }];
  }, [] as Snapshot[]);
}

// 1 => after the reference date
// -1 => before
// 0 => same
function compareDates(date: YearMonthDay, refDate: YearMonthDay) {
  if (date.year > refDate.year) return 1;
  if (date.year < refDate.year) return -1;

  if (date.month > refDate.month) return 1;
  if (date.month < refDate.month) return -1;

  if (date.day > refDate.day) return 1;
  if (date.day < refDate.day) return -1;

  return 0;
}
