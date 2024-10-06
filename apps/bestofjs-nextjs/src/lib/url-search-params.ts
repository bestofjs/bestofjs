/**
 * Convert a URLSearchParams object to a plain key-value object we can parse with Zod
 * taking into account `tags` parameter
 */
export function getSearchParamsKeyValues(searchParams: URLSearchParams) {
  return {
    ...Object.fromEntries(searchParams.entries()),
    tags: searchParams.getAll("tags"), // take into account multiple tags TODO make it more generic!
  };
}
