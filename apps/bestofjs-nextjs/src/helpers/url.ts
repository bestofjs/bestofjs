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
  date: Date
) {
  const dateParam = date.toISOString().slice(0, 16).replace(":", "-"); // 2020-01-01T00:00 => 2020-01-01T00-00
  searchParams.set("t", dateParam);
}
