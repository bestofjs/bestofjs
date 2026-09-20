# "No AI" edition

Spike for issue #459. Branch: `noai`.

## Problem

- AI projects flood the JS ecosystem: they dominate Hot Projects, Recently Added and monthly rankings.
- Part of the audience wants Best of JS without them — not "AI ranked lower", but "AI absent".
- Filtering them out for everyone is not an option: AI projects are legitimately part of the ecosystem.
- A `/no-ai` route prefix or a separate app would duplicate routing, layouts and data loading for a site that is ~99% identical.

## Strategy: one codebase, two deployments

- One env var, `BESTOFJS_APP` (`main` | `noai`), decides which app a deployment *is*.
- A registry (`apps/web/src/config/apps.ts`) maps that key to: excluded tag codes, header badge label, canonical host.
- Nothing else in the codebase branches on the app. `git diff` between the two deployments is empty — same commit, different env.
- The domain layer stays app-agnostic: `@repo/core` gains `excludedTagCodes` as an ordinary query parameter (project listings, tag listings, tag counts, related tags). It never learns `noai` exists — the admin app could reuse the same parameter.
- Bound in exactly one place: `apps/web/src/app/db.ts`, a data façade that pre-binds the deployment's excluded tags to every listing query. Per-call-site passing was the alternative and fails silently — a page that forgets looks normal, it just serves the projects the deployment exists to hide.
- Editorial exclusions (`TAGS_EXCLUDED_FROM_RANKINGS`) and deployment exclusions **merge**, never replace each other.
- Tag counts stay truthful: a project carrying a hidden tag stops counting towards the other tags it shares. A tag never advertises a count the listing cannot deliver.
- `/projects` gains `?ai=1|0`, modelled on the existing `scope` filter: same control on both deployments, only the *default* differs.
- Project detail pages are unchanged on both. The deployment changes what is **surfaced**, not what exists — which is what makes the `?ai=1` opt-out coherent.
- Detail pages therefore read `@repo/core` **directly**, not the façade: a dependency graph (and tomorrow, related projects) is a fact about the package, not a curated listing, and a non-AI project depending on an AI one is vanishingly rare. That keeps the whole route app-independent, so it can keep its file-level `"use cache"` keyed by slug alone — no `app` parameter, no `cacheTagForApp`.
- The façade is for **listings** — what the deployment chooses to put in front of people. Anything reached *from* a project someone already opened is not a listing.

## Naming

Call the two a **variant** of the same app (registry keys already `main` / `noai`):

| Concept | Value | Where |
| --- | --- | --- |
| Env var | `BESTOFJS_APP=main` \| `noai` | Vercel env, `env.mjs` |
| Registry key | `webApps.MAIN` / `webApps.NOAI` | `config/apps.ts` |
| Public name | "Best of JS" / "Best of JS — No AI" | header badge, meta |
| Host | `bestofjs.org` / `noai.bestofjs.org` | `hostByApp` |

Rules:

- `main` is the unmarked default — no badge, no suffix, identical to today.
- `noai` (one word, lowercase) everywhere in code, env and host. Never `no-ai` / `noAI` — env validation rejects them on purpose.
- Avoid "mode", "flavor" and "flag" in code names: today it is a deployment identity, not a runtime toggle.

## What it means on Vercel

- **Same Git repo, same project code, two Vercel deployments.** The `noai` variant is a deployment whose environment sets `BESTOFJS_APP=noai` — not a fork, not a branch that keeps diverging.
- Spike setup: set `BESTOFJS_APP=noai` in the Vercel dashboard scoped to the **Preview** environment / the `noai` branch. Long term: a second Vercel project on the same repo, Production env var `noai`, custom domain `noai.bestofjs.org`.
- Unset defaults to `main`: production and local dev untouched.
- An out-of-registry value fails env validation and the build stops. Deliberate — a silent fallback to `main` would serve AI projects on the No AI site while looking completely normal.
- `BESTOFJS_APP` is declared in `turbo.json` `env` so Turbo's build cache is keyed by it (otherwise both variants share one cached build).
- The build logs the app name (`next.config.ts`), since every symptom of a wrong value looks like a normal site.
- Next.js `"use cache"` excludes module-scope values from the cache key, so any cached function whose result depends on the deployment must take `app` as a real parameter and tag via `cacheTagForApp()` (`@/server/cache`). Without it, two deployments behind the same cache poison each other. The cheaper answer, where it applies, is to keep the route app-independent instead — see project detail pages above.
- Data pipeline, DB and static JSON are shared: one backend, one dataset, filtering happens at read time only.

## Not in this spike

- UI copy, explanations and cross-links between variants (only a header badge + a popover pointing to the other host).
- Per-deployment `APP_CANONICAL_URL` / sitemap / `alternates.canonical` — see "Indexing" below, which settles the question for now without touching them.
- Hall of Fame and the global project count.
- Widening excluded tags beyond `ai` (`skills`, `mcp`, ...) — depends on the tagging pass, see `docs/ai-projects-tagging.md`.

## Indexing

**Best of JS is the canonical app; the variant is not indexed.** Decided because the variant's long-term future is undecided, and it costs one branch in `robots.ts`.

- `robots.ts` returns `disallow: "/"` on any non-main deployment, and the usual `allow` + sitemap line on main.
- `APP_CANONICAL_URL` stays hardcoded to `https://bestofjs.org`. So does `sitemap.ts` — it is simply never crawled on the variant.
- `og:url` on variant pages points at bestofjs.org, which matches the decision: a share from the No AI site credits Best of JS.
- No `alternates.canonical` anywhere. Nothing emits one today, and it only matters for a crawlable variant.
- Distribution is the link from the main site (the popover in the home intro), not search.
- Upgrade path if the variant proves itself, one line: `APP_CANONICAL_URL = \`https://${hostByApp[currentApp]}\``. Robots, sitemap and every `og:url` follow automatically; consolidating variant pages into bestofjs.org vs. letting them rank on their own then becomes a separate `alternates.canonical` decision.

## Daily refresh

Each deployment has its own cache and its own build, so the daily pipeline has to reach both.

- Cache invalidation alone does not warm entries. `/api/revalidate` uses `revalidateTag(tag, { expire: 0 })`, which empties entries rather than marking them stale, and Next revalidates on request rather than on the call. The build refills the prerendered set (home, `/trends/*`, `/projects`, and the hot slugs from `generateStaticParams`); without it the first visitor after each daily run pays the full render. `{ expire: 0 }` is deliberate — "Trends today" showing yesterday's numbers until the visitor reloads is worse than one slow first hit.
  - Open alternative: replace the builds with a warming pass that GETs those URLs on each `WEBAPP_URLS` target. No credentials, no second Vercel build, and both hook variables disappear. Not adopted yet — the warming path needs verifying against how Next actually repopulates these entries.
  - Considered and rejected: skipping the daily build on `noai` altogether, to avoid a second hook. Low traffic makes warming matter *more* per visitor, not less (most page views land on a cold entry), and it makes the two deployments behave differently — the one thing this design exists to avoid. `WEBAPP_URLS` would stay plural regardless.
- `WEBAPP_URLS` — comma-separated list of deployments to revalidate (`https://bestofjs.org,https://noai.bestofjs.org`). Falls back to the single `WEBAPP_URL`.
- `FRONTEND_BUILD_WEB_HOOK` / `FRONTEND_NOAI_BUILD_WEB_HOOK` — one Vercel deploy hook per deployment, one variable each. Not a list, unlike `WEBAPP_URLS`: a deploy hook is an opaque token URL, so two concatenated into one value cannot be told apart, and the same hook pasted twice would fire successfully while leaving a deployment unbuilt. Main is required — unset, the task throws before sending anything, exactly as before; its failure fails the task too. `noai` is optional (unset = not deployed) and its failure is logged only — it costs that site a slower first visit, not correctness.
- Unset = today's behaviour, one target — with one exception. `WEBAPP_URLS` unset falls back to `WEBAPP_URL`, then to `https://bestofjs.org`; `FRONTEND_NOAI_BUILD_WEB_HOOK` unset means main is the only deployment built. `FRONTEND_BUILD_WEB_HOOK` is the exception: it has never been optional, and the task throws without it. Set them wherever the backend tasks run:
  - the static API Vercel project's env (it runs `static-api-daily`, hence `trigger-build-webapp`) — `WEBAPP_URLS` plus the two hook variables;
  - a repository **variable** for `update-trends.yml`, which runs `invalidate-trends-cache` — `WEBAPP_URLS` only. A variable, not a secret: these are the deployments' public URLs, and masking them would print `***` in the revalidation log. Neither is ambient env in Actions — both are mapped in that workflow's `env:` block, so a new one needs a line there too.
- Tag names are unchanged: `revalidateTag()` runs inside the deployment that receives the request, so the `app` tag appended by `cacheTagForApp` separates cache *entries*, not these calls.
- Failures are per-target, at two different thresholds. Cache invalidation: one deployment failing does not stop the others, and the task throws only when every target failed for a tag. Build hooks: main failing throws even if `noai` succeeded, while `noai` failing is an error line and nothing more.
- Operational cost, honestly: a second deploy hook and URL to keep in sync, and a daily build of a second Vercel project.

## Known gaps

- Global counts on the home page (`MoreProjectsSection`) come from `getProjectsStats()`, which has no excluded-tag predicate: the No AI deployment announces a total that includes AI projects, while its `/projects` listing is smaller. Same root cause as the out-of-scope items above — the stats service needs the `excludedTagCodes` parameter the listing queries got.
- Some archived ranking entries have `slug: null` because their projects no longer exist in the catalog. They cannot be resolved against the DB and are skipped.
- A hidden tag's chip on a project page links to `/projects?tags=ai`, which renders an empty list under an "All Projects" heading — the tag is filtered out of `findTags()`, so it is not even shown as a removable chip. The hover card works (see below); the click-through does not. Fixing it means detail-page chips linking to `?tags=ai&ai=1`, which is more plumbing than the spike needs.
- `findTagsWithProjects()` in the façade still has no `showExcludedTags` opt-out. No caller needs one today; add it if a tag page ever gets the same opt-out. `findTagWithProjects()` has one — `/api/tags/[slug]` passes it when the requested code is one this deployment hides, so a project page's raw `ai` chip gets a working hover card instead of a 404. Listings are unaffected: they never link to a hidden tag, and hover cards for visible tags keep their curated counts and top projects.

## Future: a "No AI" mode inside the main app

The deployment approach was chosen mainly to avoid changing the main UI. It does not close that door:

- The filtering already lives in a query parameter (`excludedTagCodes`) and a single façade — not in the deployment.
- A user-level preference (cookie or account setting) would only replace *where* `excludedTagCodes` comes from in `config/apps.ts` / `app/db.ts`. Pages, core and queries stay as they are.
- `?ai=1|0` on `/projects` is already the per-request version of that toggle.
- What a mode would additionally need: UI to set it, a cache key per preference instead of per deployment, and a decision on what the shared static JSON / OG images do.
