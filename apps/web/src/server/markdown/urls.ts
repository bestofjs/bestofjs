/** Convert a public URL to Markdown, preserving queries and fragments. */
export function markdownURL(value: string) {
  const absolute = /^https?:\/\//.test(value);
  const url = new URL(value, "https://bestofjs.org");
  const path = url.pathname.replace(/\/$/, "") || "/";
  url.pathname =
    path === "/" ? "/index.md" : path.endsWith(".md") ? path : `${path}.md`;
  return absolute ? url.toString() : `${url.pathname}${url.search}${url.hash}`;
}
