// Format a URL to be displayed, removing `http://` and trailing `/`
export function formatUrl(url: string) {
  const result = url.replace(/\/$/, "").toLowerCase();
  return result.replace(/^https?:\/\/(.*)$/, "$1");
}

/**
 * Add `&t=2024-01-01T06-00` to the URL search params
 * Some URLs need to reflect the date when JSON data is updated,
 * to avoid caching issues (E.g. OG images)
 */
export function addCacheBustingParam(
  searchParams: URLSearchParams,
  date: Date,
) {
  const dateParam = date.toISOString().slice(0, 16).replace(":", "-"); // 2020-01-01T00:00 => 2020-01-01T00-00
  searchParams.set("t", dateParam);
}

/**
 * Start of the current UTC day, for `addCacheBustingParam()` on DB-backed
 * pages: their data has no single "last build" timestamp like the old static
 * JSON did, but it's refreshed at most once a day (the `daily-update-trends`
 * pipeline), so truncating to the day is the coarsest value that still busts
 * external caches (Twitter/Slack/Facebook link previews) at the right cadence
 * without changing the URL more often than the data actually changes.
 */
export function getStartOfUtcDay(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}
