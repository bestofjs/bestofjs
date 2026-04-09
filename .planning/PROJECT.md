# Migrate Web Listing Features to Database Queries

## What This Is

A migration of Best of JS web listing features from static `projects.json` (loaded into memory, queried via `mingo`) to database-backed queries with pre-computed trend/score cache tables. This enables the project catalog to grow beyond the current ~2k cap, eliminates expensive per-request trend computation, and allows metadata edits without full rebuilds.

## Core Value

Web listing pages (`/projects`, `/tags`, home trends/rankings) must return accurate, sorted project data from the database with pre-computed scores, replacing the static JSON approach without breaking existing consumers.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Two new cache tables (`repo_trends`, `project_trends`) with daily refresh task
- [ ] Four scoring functions: popularity_score, activity_score, usage_score, relevance_score
- [ ] Web listing queries backed by DB joins instead of mingo on static JSON
- [ ] Server-side search for command-palette "Search for..." path
- [ ] Sort options: trending, hot today, most stars, most active, most used, newest
- [ ] UI labels derived at render time from score thresholds (cold, frozen, trending, etc.)
- [ ] Status-based filtering: deprecated excluded, active/featured/promoted included
- [ ] Tag-based filtering via DB subqueries
- [ ] Dual-run validation: compare static vs DB-backed results for parity

### Out of Scope

- Removing `projects.json` / `projects-full.json` — legacy consumers still need them
- Rewriting legacy app data access — separate effort
- Replacing client-side preloaded Search Palette dataset/filtering — keep existing flow
- Cold-based exclusion in list queries — ranking handles visibility instead

## Context

**Architecture:** Monorepo with `packages/db` (Drizzle ORM + PostgreSQL), a Next.js web app, and task runners that build static API files daily. The existing `projects` table has a `status` field (`active`, `featured`, `promoted`, `deprecated`) and links to `repos` (1:N) which have `snapshots` (star counts over time). Projects link to `packages` (0:N) with download data.

**Data model insight:** Stars/trends are repo-level (shared by monorepo siblings), while packages/downloads are project-level. This drives the two-table cache design: `repo_trends` (computed once per repo) and `project_trends` (once per project).

**Scoring system:** Replaces the old `shouldIncludeProjectInMainList()` boolean with multi-dimensional scores. Three dimension scores (popularity, activity, usage) serve as sort keys. One composite score (relevance) serves as a quality floor filter in WHERE clauses, never in ORDER BY.

**Package cardinality:** Projects have 0, 1, or N packages. Primary package = highest monthly downloads. No-package projects get `usage_score = 0` with adjusted relevance weights so they aren't penalized.

**Current data volume:** ~3,500 projects across statuses. Cache tables will be tiny (~200KB + ~150KB). Sub-millisecond queries expected.

## Constraints

- **Tech stack**: Drizzle ORM + PostgreSQL — must use existing `packages/db` patterns
- **Compatibility**: Static JSON API must continue working unchanged during migration
- **Data integrity**: Daily refresh task runs alongside existing `buildStaticApiTask`
- **Status policy**: `deprecated` = hard exclude from queries and star tracking; `promoted` = admin-only signal with no user-facing behavior; `featured` = curated homepage modules only

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Two cache tables (repo_trends + project_trends) instead of one | Stars/trends are repo-level, downloads are project-level; monorepo siblings share star data | — Pending |
| Multi-dimensional scores instead of boolean is_included | Boolean loses nuance; scores enable user-chosen sort and quality floor filtering | — Pending |
| Primary package selection (highest monthly downloads) | Simplest approach for v1; avoids aggregating across all packages | — Pending |
| ILIKE search first, optional pg_trgm later | ILIKE sufficient for current data volume; upgrade path exists | — Pending |
| No cold-based exclusion in list queries | Ranking handles visibility; avoids premature filtering decisions | — Pending |
| Relevance score in WHERE only, never ORDER BY | Quality floor is a filter concern, not a sorting concern | — Pending |

---
*Last updated: 2026-04-09 after initialization*
