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
- Next.js `"use cache"` excludes module-scope values from the cache key, so cached functions must take `app` as a real parameter and tag via `cacheTagForApp()` (`@/server/cache`). Without it, two deployments behind the same cache poison each other.
- Data pipeline, DB and static JSON are shared: one backend, one dataset, filtering happens at read time only.

## Not in this spike

- UI copy, explanations and cross-links between variants (only a header badge + a popover pointing to the other host).
- `robots` / `sitemap` / canonical per deployment — `APP_CANONICAL_URL` is hardcoded; that is the real blocker before pointing DNS.
- Hall of Fame and the global project count.
- Widening excluded tags beyond `ai` (`skills`, `mcp`, ...) — depends on the tagging pass, see `docs/ai-projects-tagging.md`.

## Known gaps

- Global counts on the home page (`MoreProjectsSection`) come from `getProjectsStats()`, which has no excluded-tag predicate: the No AI deployment announces a total that includes AI projects, while its `/projects` listing is smaller. Same root cause as the out-of-scope items above — the stats service needs the `excludedTagCodes` parameter the listing queries got.
- `findTagsWithProjects()` / `findTagWithProjects()` in the façade have no `showExcludedTags` opt-out. No caller needs one today (`?ai=1` only reaches `/projects`); add it if a tag page ever gets the same opt-out.

## Future: a "No AI" mode inside the main app

The deployment approach was chosen mainly to avoid changing the main UI. It does not close that door:

- The filtering already lives in a query parameter (`excludedTagCodes`) and a single façade — not in the deployment.
- A user-level preference (cookie or account setting) would only replace *where* `excludedTagCodes` comes from in `config/apps.ts` / `app/db.ts`. Pages, core and queries stay as they are.
- `?ai=1|0` on `/projects` is already the per-request version of that toggle.
- What a mode would additionally need: UI to set it, a cache key per preference instead of per deployment, and a decision on what the shared static JSON / OG images do.
