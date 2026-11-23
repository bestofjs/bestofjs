# Markdown for agents

The public site is HTML. On bestofjs.org you can also fetch catalog pages as
Markdown through route handlers, `.md` URLs, `Accept: text/markdown`, and
`/llms.txt`.

Deployment rules and main-only indexing are in [`noai-app.md`](./noai-app.md).
This file explains routing and how to extend it.

## Goals

- Give agents and tools catalog pages without HTML scraping.
- Use the same loaders and DB queries as the HTML pages.
- Do not expose Markdown on the No AI deployment (`BESTOFJS_APP=noai`).
- Link out to GitHub READMEs on project pages. Honor `packagePath` for monorepo
  subfolders. Do not embed README bodies in Markdown responses.

## Where it runs

| Surface | `BESTOFJS_APP=main` | `BESTOFJS_APP=noai` |
| --- | --- | --- |
| `/llms.txt` | 200 | 404 |
| `*.md` / `Accept: text/markdown` | Negotiated | 404 |
| Internal `/…/markdown` routes | Blocked at proxy (public use `.md` or Accept) | Plain 404 |
| `robots.txt` | Allow + sitemap | `disallow: /` |

Canonical URLs and the sitemap stay on bestofjs.org. The No AI host is for
humans who want listings without AI-tagged projects. It is not a second agent
endpoint.

## How clients request Markdown

1. Discovery: `GET /llms.txt` lists supported pages and rules.
2. Explicit suffix: `GET /projects/react.md`. Query strings are preserved.
3. Content negotiation: `GET /projects` with `Accept: text/markdown`. Markdown
   must outrank `text/html` in the Accept header. A bare `*/*` stays HTML.
4. Home: `/index.md`, or `Accept: text/markdown` on `/`.

Supported HTML pages send:

`Link: </path.md?…>; rel="alternate"; type="text/markdown"`

and `Vary: Accept`. `apps/web/src/proxy.ts` sets those headers.

On paginated list pages (`/projects`, `/featured`, `/hall-of-fame/search`),
`generateMetadata` must pass non-default query params into `markdownMetadata()` so
the advertised `.md` URL matches the HTML page.

## Architecture

```
  Client
    |
    |  GET /featured.md?page=2&sort=most-stars
    |  GET /featured?page=2  +  Accept: text/markdown
    v
+-------------------------------------------------------------+
|  apps/web/src/proxy.ts  (Next.js Proxy / middleware)        |
|  - decode path segments (reserved "markdown" check)         |
|  - isMainApp gate (.md, llms.txt, internal markdown)        |
|  - match markdownPages allowlist                            |
|  - rewrite -> /featured/markdown  OR  Link alternate (HTML) |
|  - optional: x-bestofjs-markdown-fallback header            |
+-------------------------------------------------------------+
    |
    |  rewrite (Markdown)                    next() (HTML/RSC)
    v                                        v
+----------------------------+     +-------------------------+
|  app/**/markdown/route.ts |     |  app/**/page.tsx        |
|  (Route Handlers)          |     |  (RSC pages)            |
|  markdownResponse()        |     |  same data loaders      |
+----------------------------+     +-------------------------+

If negotiation wanted Markdown but no page matched:
  fallback rewrite (next.config) + MARKDOWN_FALLBACK_HEADER
    ->  GET /markdown/not-found  (Markdown 404 body)
```

The proxy does not render Markdown. It only routes. Each page owns a colocated
`markdown/route.ts` handler.

## Routing mental model (proxy decision flow)

```
                    Request enters proxy
                              |
                              v
              +-------------------------------+
              | Decode pathname per segment   |
              | (catch malformed % encoding)  |
              +-------------------------------+
                              |
              +---------------+---------------+
              | Any segment == "markdown" ?   |
              +---------------+---------------+
                     yes |            | no
                         v            v
              +--------------+   +------------------+
              | main?        |   | !isMainApp AND   |
              | MD 404 : 404 |   | (.md OR llms.txt)|
              +--------------+   | -> plain 404     |
                               | else continue    |
                               +------------------+
                                        |
                              GET/HEAD only for MD path
                                        |
              +-------------------------+-------------------------+
              | publicPath from URL      | explicit .md ?          |
              | (/index.md -> /)         | strip suffix            |
              +-------------------------+-------------------------+
                                        |
              | RSC / prefetch / _rsc ?  -> treat as internal (no MD rewrite)
              |
              | explicit .md OR prefersMarkdown(Accept) ?
              |        no  -> HTML + Link alternate (if supported)
              |        yes -> supported in markdownPages[] ?
              |                 no + explicit .md -> markdownNotFound()
              |                 no + Accept only -> HTML fallback chain
              |                 yes -> rewrite to {publicPath}/markdown
              v
```

Keep `markdownPages` in `proxy.ts` aligned with real `app/**/markdown/route.ts`
files. A regex match without a handler yields a normal Next 404, not the
Markdown 404 template.

Current allowlist:

- Home, projects (+ slug), tags, featured, hall-of-fame (+ search)
- Rankings monthly (+ year/month), trends (weekly/monthly/yearly)
- About, privacy

`/tags/:tag` still redirects to `/projects?tags=…`. The redirect regex in
`next.config.ts` must not match `markdown` or `*.md` paths.

## Shared helpers

| Module | Role |
| --- | --- |
| `server/markdown/accept.ts` | `prefersMarkdown()`, fallback header name |
| `server/markdown/response.ts` | `markdownResponse()`, `markdownNotFound()` |
| `server/markdown/format.ts` | Escaping, project lists, query parsing |
| `server/markdown/urls.ts` | `.md` URL mapping; `githubReadmeURL()` for projects |
| `server/markdown/metadata.ts` | `<link rel="alternate" type="text/markdown">` (main only) |

## Adding a new Markdown page (checklist)

1. Add `app/<route>/markdown/route.ts` using the same data loader as the HTML page.
2. Add a matching regex to `markdownPages` in `proxy.ts`.
3. Call `markdownMetadata(...)` on the HTML page. Include the query string when
   the page is paginated or filtered.
4. Add the page to `/llms.txt` when it is a top-level entry point.
5. Extend `server/markdown/markdown.test.ts` when proxy rules change.
6. Smoke test: `.md` URL, `Accept: text/markdown`, unsupported `.md` returns
   Markdown 404.

## Testing

- Unit: `pnpm -F web test` covers proxy negotiation, the allowlist, and No AI gates.
- E2E: `pnpm -F web test:e2e` runs `markdown-404.spec.ts`.
- Manual with `BESTOFJS_APP=main`:
  - `curl -sI -H 'Accept: text/markdown' https://bestofjs.org/projects | grep -i link`
  - `curl -s https://bestofjs.org/llms.txt | head`
- Manual on noai: `.md` and `/llms.txt` return 404 without a `text/markdown` body
  on reserved paths.

## Operational notes

- Markdown responses use `Cache-Control: private, no-store`.
- Project Markdown links use `packagePath` and `default_branch` for README URLs.
- The path segment `markdown` is internal. Decode percent-encoded segments before
  the reserved-segment check. See `server/markdown/markdown.test.ts`.