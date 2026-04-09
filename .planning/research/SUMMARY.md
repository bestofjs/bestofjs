# Project Research Summary

**Project:** Migrate Best of JS Web Listings to Database Queries
**Domain:** Database-backed listing/ranking migration for open-source project catalog
**Researched:** 2026-04-09
**Confidence:** HIGH

## Executive Summary

Best of JS currently serves project listings by building a static JSON file daily, loading it entirely into memory, and querying it with mingo (a MongoDB query engine for JS arrays). This migration replaces the mingo query layer with direct PostgreSQL queries against pre-computed cache tables, while keeping the exact same API interface so page components require zero changes. The entire existing stack (Next.js 16, Drizzle ORM, PostgreSQL via Vercel/Neon, TypeScript) is locked in and no new dependencies are needed -- the migration is purely about adding two cache tables, a refresh task, and a new query module.

The recommended approach is a phased migration with a strict dependency chain: first build the cache table foundation (schema + scores + refresh task), then the listing query module in `packages/db`, then an API adapter that implements the same interface as the existing `createAPI()` factory, and finally a dual-run validation layer to prove parity before cutover. This order is non-negotiable because every downstream component depends on cache tables being populated with correct data. The cache tables use regular PostgreSQL tables (not materialized views) with daily UPSERT refresh -- this is the right call given Drizzle's incomplete materialized view support and the tiny data volume (~3,500 rows).

The key risks are: (1) relevant tag computation silently breaking when switching from in-memory full-result iteration to SQL with LIMIT/OFFSET, (2) NULL values in trend columns distorting sort order since PostgreSQL sorts NULLs highest in DESC, (3) sort field mapping errors between mingo dot-notation keys and actual DB columns across JOINs, and (4) dual-run validation comparing the wrong things because the old and new systems use fundamentally different filtering logic. All four risks have straightforward mitigations documented in the pitfalls research and must be addressed in their respective phases, not deferred.

## Key Findings

### Recommended Stack

No new packages are required. The migration builds entirely on the existing monorepo stack. The only new artifacts are schema files, a migration, query functions, and a refresh task.

**Core technologies (all already installed):**
- **Drizzle ORM 0.44.5:** Schema definitions for cache tables, type-safe query builder for listings, `onConflictDoUpdate` for daily refresh upserts
- **PostgreSQL (Vercel/Neon):** ILIKE for search, standard JOINs and aggregations for listings, NULL handling via NULLS LAST
- **Next.js 16 `cacheLife` + `'use cache'`:** Daily cache profile already configured; listing pages should use it since cache tables refresh daily
- **`sql` template tag from drizzle-orm:** Raw SQL fragments for scoring formulas in SELECT/ORDER BY where Drizzle helpers are too verbose

**What NOT to use:** Materialized views (Drizzle tooling gaps), Redis (over-engineering for ~350KB daily-refresh data), pg_trgm (premature at 3.5K projects), tRPC (no API layer needed with Server Components), Drizzle v1 beta (breaking changes).

### Expected Features

**Must have (table stakes -- the DB migration must reproduce all of these):**
- All 9 non-bookmark sort options (stars, 4 trend windows, downloads, last commit, contributors, created date, date added)
- Multi-tag filtering with $all semantics (intersection, not union)
- ILIKE text search for server-side search path
- Pagination with total count
- Relevant tag suggestions computed from full filtered result set
- Status-based exclusion (deprecated projects hidden)
- Relevance score quality floor replacing `shouldIncludeProjectInMainList()`
- Home page sections: hot projects, newest projects, featured projects, popular tags

**Should have (competitive):**
- Multi-dimensional scoring (popularity, activity, usage as separate axes)
- UI labels derived from score thresholds (trending, hot, cold, frozen)
- Composite sort stability (deterministic ordering via SQL)
- Metadata edits reflected without full rebuild

**Defer (v2+):**
- pg_trgm fuzzy search (only if ILIKE proves insufficient above 10K projects)
- Server-side search for command palette (separate effort, high risk)
- Additional scoring dimensions (documentation quality, issue response time)

### Architecture Approach

The architecture is a clean write-path / read-path split. The write path is a daily refresh task that computes trends from snapshots and scores from trends, writing results into `repo_trends` (keyed by repo) and `project_trends` (keyed by project). The read path is a new listing query module in `packages/db/src/listings/` that JOINs projects to cache tables, applies filters, sorts, and paginates. A thin API adapter (`api-database.ts`) implements the exact same interface as the existing `createAPI()` factory, making the swap invisible to page components.

**Major components:**
1. **Cache table schemas** (`packages/db/src/schema/`) -- `repo_trends` and `project_trends` with daily UPSERT refresh
2. **Score functions** (`packages/db/src/scores/`) -- Pure functions: `popularityScore`, `activityScore`, `usageScore`, `relevanceScore`
3. **Cache refresh task** (`apps/backend/src/tasks/`) -- Daily task running after existing `buildStaticApiTask`, populating both cache tables
4. **Listing query module** (`packages/db/src/listings/`) -- DB-backed replacements for all mingo queries
5. **Web API adapter** (`apps/web/src/server/api-database.ts`) -- Same interface as `createAPI()`, translates mingo-style params to Drizzle queries
6. **Dual-run validator** -- Compares static JSON vs DB results with defined parity criteria (set-level, not position-level)

### Critical Pitfalls

1. **Relevant tags break with LIMIT/OFFSET** -- The current system computes tags from ALL matching projects, not just the current page. The DB query must run a separate aggregation on the full filtered set (without LIMIT) or use a CTE. Must be solved in the same phase as listing queries.

2. **NULL trend values float to top of DESC sorts** -- PostgreSQL sorts NULLs highest in DESC. Use `desc(column).nullsLast()` on all trend/download sort clauses. Decide NULL vs 0 semantics at schema design time: 0 = computed but zero, NULL = cannot compute.

3. **Sort field mapping errors across JOINs** -- Each of the 9 sort options maps to a different table and column. Build an explicit mapping object, not inline logic. Test every sort option individually during dual-run.

4. **Dual-run compares wrong things** -- Old system uses boolean `shouldIncludeProjectInMainList()`, new system uses multi-dimensional `relevance_score`. Define parity as set-level overlap with tolerance, not exact position matching.

5. **Monorepo sibling deduplication** -- Multiple projects share one repo. `repo_trends` must be keyed by `repo_id` (not `project_id`). Test with known monorepo siblings.

## Implications for Roadmap

Based on research, the migration has a strict dependency chain that dictates phase ordering. Five phases are recommended.

### Phase 1: Cache Table Foundation
**Rationale:** Everything depends on cache tables existing and being populated. No listing query can run without them. This is the foundation.
**Delivers:** `repo_trends` and `project_trends` schemas, Drizzle migration, pure score functions, daily refresh task integrated with `buildStaticApiTask`
**Addresses:** Cache tables (P1), daily refresh task (P1), relevance quality floor (P1)
**Avoids:** NULL handling pitfall (decide 0 vs NULL at schema time), monorepo deduplication (key `repo_trends` by repo_id), primary package selection (filter deprecated packages), stale cache (run refresh alongside existing task)

### Phase 2: Listing Query Module
**Rationale:** With cache tables populated, the query module can be built and tested in isolation against real data, without touching the web app.
**Delivers:** `packages/db/src/listings/` with `findProjects`, sort key mapping, tag filtering, ILIKE search, relevance floor, relevant tag aggregation, pagination
**Addresses:** All 9 sort options (P1), multi-tag filtering (P1), text search (P1), pagination (P1), relevant tags (P1), status exclusion (P1)
**Avoids:** Relevant tags pitfall (separate aggregation query on full filtered set), sort field mismatch (explicit mapping object tested per sort key)

### Phase 3: Web API Adapter + Dual-Run Validation
**Rationale:** The adapter bridges old interface to new queries. Dual-run proves parity before any user-facing change. This is the confidence-building phase.
**Delivers:** `api-database.ts` implementing `createAPI()` interface, query parameter translation layer, dual-run comparison tooling with defined parity criteria, feature flag for switching
**Addresses:** Dual-run validation (P2), home page queries from DB (P2)
**Avoids:** Dual-run parity pitfall (define set-level comparison with tolerance, not position-exact), API interface change anti-pattern (keep exact same interface)

### Phase 4: Home Page + Auxiliary Pages Migration
**Rationale:** After `/projects` is validated via dual-run, extend DB queries to home page sections and monthly rankings. Lower risk because the query module is proven.
**Delivers:** Hot projects, newest projects, featured project enrichment, monthly rankings enrichment -- all from DB instead of static JSON
**Addresses:** Home page hot/newest (P2), featured projects (P2), monthly rankings (P2), UI score labels (P2)

### Phase 5: Cutover + Cleanup
**Rationale:** Flip the feature flag to make DB the primary source. Remove dual-run code. Static JSON continues building for legacy consumers but is no longer read by the web app.
**Delivers:** DB as sole data source for listings, removal of mingo dependency from listing path, cleaned up code
**Addresses:** Full migration completion

### Phase Ordering Rationale

- Phases 1-2-3 form an unbreakable dependency chain: queries need cache tables, the adapter needs queries, dual-run needs the adapter.
- Phase 4 could technically run in parallel with Phase 3 for home page queries, but it is safer to validate the query module on `/projects` first before extending.
- Phase 5 is a cleanup/cutover phase that should only happen after dual-run proves parity at acceptable tolerance levels.
- Score functions are placed in Phase 1 (not Phase 2) because the refresh task needs them to populate cache tables.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** Score function weights and relevance threshold need tuning. The formulas in ARCHITECTURE.md are starting points but the threshold for "include in main list" needs calibration against `shouldIncludeProjectInMainList()` output to minimize unexpected inclusions/exclusions.
- **Phase 3:** Dual-run parity criteria need precise definition. What tolerance is acceptable? How many set-level differences are OK? This needs a spike before building the validation tooling.

Phases with standard patterns (skip research-phase):
- **Phase 2:** Well-documented Drizzle query patterns already exist in `packages/db/src/projects/find.ts`. The listing module extends these patterns.
- **Phase 4:** Straightforward application of Phase 2 query module to additional pages. No new patterns needed.
- **Phase 5:** Standard feature flag flip and dead code removal.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies already installed and in use. No new dependencies. Verified against codebase. |
| Features | HIGH | Complete feature inventory derived from codebase analysis of existing sort options, page components, and API surface. |
| Architecture | HIGH | Architecture mirrors existing patterns in the codebase. Cache table design validated against Drizzle capabilities and PostgreSQL best practices. |
| Pitfalls | HIGH | Pitfalls grounded in specific codebase analysis (e.g., exact mingo query paths, NULL behavior in PostgreSQL, relevant tags computation flow). |

**Overall confidence:** HIGH

### Gaps to Address

- **Score function calibration:** The exact weights for `popularityScore`, `activityScore`, `usageScore`, and `relevanceScore` are educated guesses. They need to be calibrated by comparing output against the current `shouldIncludeProjectInMainList()` filter to ensure similar inclusion/exclusion behavior. Address during Phase 1 implementation.
- **Relevance threshold value:** What score value constitutes the quality floor? Needs empirical testing against the current ~2K "main list" vs ~3.5K "full list" split. Address during Phase 1.
- **Dual-run tolerance levels:** How much set-level divergence is acceptable before cutover? 1%? 5%? Needs product decision. Address before Phase 3.
- **`quarterly` trend window:** ARCHITECTURE.md includes a `quarterly` column in `repo_trends` that is not present in the current static JSON or sort options. Clarify whether this is needed or can be deferred.

## Sources

### Primary (HIGH confidence)
- Codebase analysis of `packages/db/src/schema/`, `packages/db/src/projects/find.ts`, `apps/web/src/server/api-projects.tsx`, `apps/backend/src/tasks/build-static-api.task.ts`
- Drizzle ORM docs (v0.44.5): views, migrations, `onConflictDoUpdate`
- Next.js 16 docs: `cacheLife`, `'use cache'` directive
- `.planning/PROJECT.md`: scoring system design, cache table architecture, constraints

### Secondary (MEDIUM confidence)
- PostgreSQL docs: materialized views, `pg_trgm`, NULL sort behavior
- Vercel Postgres/Neon connection pooling documentation

---
*Research completed: 2026-04-09*
*Ready for roadmap: yes*
