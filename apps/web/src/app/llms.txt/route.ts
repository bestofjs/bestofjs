import { isMainApp } from "@/config/apps";
export function GET() {
  if (!isMainApp) return new Response(null, { status: 404 });
  return new Response(
    `# Best of JS

> A human-curated catalog of JavaScript, TypeScript, and web-platform projects, with discovery and popularity trends based on public GitHub data.

Use Best of JS to discover web projects, browse categories, and compare GitHub popularity trends. Check upstream documentation and security information before choosing a dependency. Stars indicate popularity, not quality, security, or suitability.

## Pages

- [Home](https://bestofjs.org/index.md): Daily trends, newest projects, popular categories, catalog statistics, latest monthly ranking.
- [Projects](https://bestofjs.org/projects.md): Search and filter the catalog.
- [Tags](https://bestofjs.org/tags.md): Browse categories.
- [Monthly rankings](https://bestofjs.org/rankings/monthly.md): Historical star growth.
- [Featured projects](https://bestofjs.org/featured.md): Editorial selection.
- [Hall of Fame](https://bestofjs.org/hall-of-fame.md): People behind web projects.
- [About](https://bestofjs.org/about.md)
- [Contact](https://bestofjs.org/contact.md)
- [Privacy](https://bestofjs.org/privacy.md)
- [Sitemap](https://bestofjs.org/sitemap.xml)

## Markdown access

Append .md to a supported page path: /projects/react.md. Use /index.md for the homepage. Alternatively send Accept: text/markdown to the HTML URL, including /. Query parameters are preserved: /projects.md?tags=react&sort=weekly&page=2. Follow pagination links for further results. Unsupported .md paths return a Markdown 404. HTML pages without a Markdown presentation remain HTML. Internal /markdown paths are reserved and are not public endpoints.

## Freshness and data

GitHub data is normally refreshed daily; monthly rankings are historical snapshots. Refreshes can be delayed. The website uses database-backed project metadata and trend queries, while historical monthly scores come from archived JSON. Static JSON exports may differ in filtering, schema, and freshness; this guide does not promise a supported public JSON API. Prefer the page representations and their update information.

Markdown is available on the main bestofjs.org deployment only. Project Markdown links to the upstream README; it does not include the README body.
`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
