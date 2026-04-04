/** GitHub pagination: `Link` header entry with `rel="last"` includes `page=N`. */
export function parseLastPageFromLinkHeader(
  link: string | null,
): number | undefined {
  if (!link) return undefined;
  for (const part of link.split(",")) {
    const trimmed = part.trim();
    if (!trimmed.includes('rel="last"')) continue;
    // `^<([^>]+)>`: segment starts with `<url>`; capture group 1 is the URL (runs until the next `>`).
    const urlMatch = trimmed.match(/^<([^>]+)>/);
    if (!urlMatch) continue;
    try {
      const page = new URL(urlMatch[1]).searchParams.get("page");
      if (page) {
        const n = parseInt(page, 10);
        if (!Number.isNaN(n)) return n;
      }
    } catch {}
  }
  return undefined;
}
