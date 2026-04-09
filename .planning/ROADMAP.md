# Roadmap: Migrate Web Listing Features to Database Queries

## Overview

This migration replaces in-memory mingo queries on static JSON with PostgreSQL-backed listing queries using pre-computed cache tables. The work follows a strict dependency chain: first build the cache table foundation (schema, scores, refresh task), then the listing query module that reads from those tables, then wire queries into web pages, and finally validate parity with dual-run comparison before cutover. Four phases, each delivering a coherent capability that unblocks the next.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Cache Foundation** - Schema, scoring functions, and daily refresh task that populate repo_trends and project_trends tables
- [ ] **Phase 2: Listing Query Module** - DB-backed sort, filter, search, and pagination queries in packages/db
- [ ] **Phase 3: Web Integration** - Wire DB queries into /projects, home page sections, and auxiliary pages
- [ ] **Phase 4: Validation and Cutover** - Dual-run parity comparison and switch to DB as primary data source

## Phase Details

### Phase 1: Cache Foundation
**Goal**: Pre-computed trend and score data is available in the database for all active projects and repos, refreshed daily
**Depends on**: Nothing (first phase)
**Requirements**: CACHE-01, CACHE-02, CACHE-03, CACHE-04, CACHE-05, SCORE-01, SCORE-02, SCORE-03, SCORE-04, DATA-01, DATA-03
**Success Criteria** (what must be TRUE):
  1. Running the refresh task populates repo_trends with star counts, trend deltas, popularity_score, and activity_score for every repo linked to an active/featured/promoted project
  2. Running the refresh task populates project_trends with primary package name, monthly downloads, usage_score, and relevance_score for every active/featured/promoted project
  3. Monorepo siblings sharing a repo produce exactly one repo_trends row (keyed by repo_id), not one per project
  4. Projects without packages receive usage_score of 0 and an adjusted relevance_score that does not penalize them unfairly
  5. Deprecated project repos are excluded from star tracking and cache table population
**Plans:** 4 plans

Plans:
- [ ] 01-01-PLAN.md — Define repo_trends and project_trends Drizzle schemas and generate migration
- [ ] 01-02-PLAN.md — TDD scoring functions (popularity, activity, usage, relevance) and primary package resolution
- [ ] 01-03-PLAN.md — Build daily refresh task with two-pass cache population and CLI registration
- [ ] 01-04-PLAN.md — Add scores export to packages/db/package.json

### Phase 2: Listing Query Module
**Goal**: A standalone query module in packages/db can sort, filter, search, and paginate projects using cache table data
**Depends on**: Phase 1
**Requirements**: LIST-01, LIST-02, LIST-03, LIST-04, LIST-05, LIST-06, LIST-07, LIST-08, LIST-09, LIST-10, LIST-11, LIST-12, SRCH-01, SRCH-02, DATA-02
**Success Criteria** (what must be TRUE):
  1. Calling the query module with any of the 9 sort options (stars, 4 trend windows, downloads, last commit, contributors, date added) returns correctly ordered results with NULL values sorting last
  2. Filtering by multiple tags returns only projects matching ALL specified tags (intersection semantics)
  3. ILIKE search on project name, description, repo name, and owner returns matching results from the database
  4. Paginated queries return correct page of results plus accurate total count, and relevant tag suggestions are computed from the full filtered set (not just the current page)
  5. Static JSON API continues building unchanged alongside the new query module
**Plans**: TBD

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD

### Phase 3: Web Integration
**Goal**: All web listing pages read project data from DB queries instead of static JSON
**Depends on**: Phase 2
**Requirements**: WEB-01, WEB-02, WEB-03, WEB-04, WEB-05, WEB-06
**Success Criteria** (what must be TRUE):
  1. The /projects page loads all sort/filter/search/pagination results from DB-backed queries with no fallback to static JSON
  2. Home page hot projects and newest projects sections load from DB queries
  3. Home page featured projects section is enriched from DB data
  4. Monthly rankings page loads from DB queries
  5. Project cards display the contextual metric matching the active sort option (star count when sorting by stars, daily delta when sorting by trending, downloads when sorting by most used, etc.)
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

### Phase 4: Validation and Cutover
**Goal**: Proven parity between old and new systems, with DB as the sole data source for web listings
**Depends on**: Phase 3
**Requirements**: VALID-01, VALID-02, VALID-03
**Success Criteria** (what must be TRUE):
  1. Dual-run comparison tool shows set-level overlap between static JSON and DB results within acceptable tolerance for all listing queries
  2. Each of the 9 sort options has been individually validated during dual-run with results logged
  3. NULL trend values consistently sort last in all descending-order queries (NULLS LAST semantics verified)
**Plans**: TBD

Plans:
- [ ] 04-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Cache Foundation | 0/4 | Planning complete | - |
| 2. Listing Query Module | 0/2 | Not started | - |
| 3. Web Integration | 0/2 | Not started | - |
| 4. Validation and Cutover | 0/1 | Not started | - |
