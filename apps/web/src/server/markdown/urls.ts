/** Convert a public URL to Markdown, preserving queries and fragments. */
export function markdownURL(value: string) {
  const absolute = /^https?:\/\//.test(value);
  const url = new URL(value, "https://bestofjs.org");
  const path = url.pathname.replace(/\/$/, "") || "/";
  url.pathname =
    path === "/" ? "/index.md" : path.endsWith(".md") ? path : `${path}.md`;
  return absolute ? url.toString() : `${url.pathname}${url.search}${url.hash}`;
}

export function githubReadmeURL(
  fullName: string,
  defaultBranch?: string | null,
  packagePath?: string | null,
) {
  const repository = `https://github.com/${fullName}`;
  const path = encodeSegments(packagePath);
  if (!path) return `${repository}#readme`;
  const branch = encodeSegments(defaultBranch) || "main";
  return `${repository}/tree/${branch}/${path}#readme`;
}

function encodeSegments(value: string | null | undefined) {
  return (value ?? "")
    .trim()
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/");
}
