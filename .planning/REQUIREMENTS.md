# Requirements: Migrate Web Listing Features to Database Queries

**Defined:** 2026-04-09
**Core Value:** Web listing pages return accurate, sorted project data from the database with pre-computed scores, replacing the static JSON approach without breaking existing consumers.

## v1 Requirements

Requirements for initial migration. Each maps to roadmap phases.

### Cache Infrastructure

- [ ] **CACHE-01**: `repo_trends` table stores per-repo star counts, trend deltas (daily/weekly/monthly/quarterly/yearly), popularity_score, and activity_score
- [ ] **CACHE-02**: `project_trends` table stores per-project primary package name, monthly downloads, usage_score, and relevance_score
- [ ] **CACHE-03**: Daily refresh task computes and upserts all cache table data alongside existing `buildStaticApiTask`
- [ ] **CACHE-04**: Refresh task deduplicates repo-level computation for monorepo siblings (one `computeTrends()` call per repo, not per project)
- [ ] **CACHE-05**: Refresh task resolves primary package as highest monthly downloads for each project

### Scoring

- [ ] **SCORE-01**: `popularity_score` computed as signed log scale of blended star trends (daily/monthly/yearly weighted)
- [ ] **SCORE-02**: `activity_score` computed as log2 decay from last commit date with contributor bonus (0–100)
- [ ] **SCORE-03**: `usage_score` computed as log10 of monthly downloads (0–100), 0 for projects without packages
- [ ] **SCORE-04**: `relevance_score` computed as weighted blend of popularity, activity, and usage with adjusted weights for no-package projects

### Listing Queries

- [ ] **LIST-01**: User can sort projects by total stars (descending)
- [ ] **LIST-02**: User can sort projects by daily/weekly/monthly/yearly star trends (descending)
- [ ] **LIST-03**: User can sort projects by monthly downloads (descending)
- [ ] **LIST-04**: User can sort projects by last commit date (descending)
- [ ] **LIST-05**: User can sort projects by contributor count (descending)
- [ ] **LIST-06**: User can sort projects by creation date (ascending, oldest first)
- [ ] **LIST-07**: User can sort projects by date added to Best of JS (descending, newest first)
- [ ] **LIST-08**: User can filter projects by multiple tags with intersection ($all) semantics
- [ ] **LIST-09**: User can search projects by name and description via server-side ILIKE query
- [ ] **LIST-10**: User can paginate results with page controls and total result count
- [ ] **LIST-11**: User sees relevant tag suggestions computed from the full filtered result set (not just current page)
- [ ] **LIST-12**: Deprecated projects are excluded from all listing queries via status filter

### Web Integration

- [ ] **WEB-01**: `/projects` page uses DB-backed queries instead of static JSON + mingo for all sort/filter/search/pagination
- [ ] **WEB-02**: Home page hot projects section loads from DB query (top by daily/weekly trends)
- [ ] **WEB-03**: Home page newest projects section loads from DB query (top by added_at)
- [ ] **WEB-04**: Home page featured projects section enriched from DB instead of static JSON
- [ ] **WEB-05**: Monthly rankings page enriched from DB instead of static JSON
- [ ] **WEB-06**: Project cards display contextual metric based on active sort option (stars, delta, downloads, etc.)

### Search

- [ ] **SRCH-01**: "Search for..." command palette path triggers server-side DB search (ILIKE on project name and description)
- [ ] **SRCH-02**: Search also matches repo name and owner fields

### Validation

- [ ] **VALID-01**: Dual-run comparison tool validates parity between static JSON and DB-backed results at set level
- [ ] **VALID-02**: All 9 sort options individually validated during dual-run
- [ ] **VALID-03**: NULL trend values sort last in descending order (NULLS LAST semantics)

### Data Integrity

- [ ] **DATA-01**: Only repos linked to active/featured/promoted projects are included in daily star tracking
- [ ] **DATA-02**: Static JSON API continues building unchanged for legacy/non-migrated consumers
- [ ] **DATA-03**: `repo_trends` keyed by `repo_id` (not `project_id`) to handle monorepo siblings correctly

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhanced Search

- **SRCH-03**: pg_trgm fuzzy search upgrade for better typo tolerance and partial matching
- **SRCH-04**: Server-side search replacing client-side preloaded Search Palette dataset

### Enhanced Scoring

- **SCORE-05**: Relevance score threshold tuning based on empirical comparison with `shouldIncludeProjectInMainList()` output
- **SCORE-06**: Additional scoring dimensions (documentation quality, issue response time)

### UI Enhancements

- **UI-01**: UI labels derived from score thresholds (trending, hot, cold, frozen) displayed on project cards

## Out of Scope

| Feature | Reason |
|---------|--------|
| Removing `projects.json` / `projects-full.json` | Legacy consumers still need them; no removal in this phase |
| Rewriting legacy app data access | Separate effort, not part of listing migration |
| Replacing client-side Search Palette dataset/filtering | Keep existing preloaded flow untouched |
| Cold-based exclusion in list queries | Ranking handles visibility; let cold projects sink via scores |
| Real-time star counts | GitHub API rate limits make real-time impossible; daily batch is the ceiling |
| Bookmark/favorite sort in DB | Bookmarks are per-user client state; keep client-side only |
| GraphQL API for listings | Over-engineering; direct DB access via Server Components is sufficient |
| Faceted search with numeric range filters | Exponential UI complexity for minimal value in a curated catalog |
| Infinite scroll | Breaks shareable URLs and browser back-button; keep pagination |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CACHE-01 | Phase 1 | Pending |
| CACHE-02 | Phase 1 | Pending |
| CACHE-03 | Phase 1 | Pending |
| CACHE-04 | Phase 1 | Pending |
| CACHE-05 | Phase 1 | Pending |
| SCORE-01 | Phase 1 | Pending |
| SCORE-02 | Phase 1 | Pending |
| SCORE-03 | Phase 1 | Pending |
| SCORE-04 | Phase 1 | Pending |
| LIST-01 | Phase 2 | Pending |
| LIST-02 | Phase 2 | Pending |
| LIST-03 | Phase 2 | Pending |
| LIST-04 | Phase 2 | Pending |
| LIST-05 | Phase 2 | Pending |
| LIST-06 | Phase 2 | Pending |
| LIST-07 | Phase 2 | Pending |
| LIST-08 | Phase 2 | Pending |
| LIST-09 | Phase 2 | Pending |
| LIST-10 | Phase 2 | Pending |
| LIST-11 | Phase 2 | Pending |
| LIST-12 | Phase 2 | Pending |
| WEB-01 | Phase 3 | Pending |
| WEB-02 | Phase 3 | Pending |
| WEB-03 | Phase 3 | Pending |
| WEB-04 | Phase 3 | Pending |
| WEB-05 | Phase 3 | Pending |
| WEB-06 | Phase 3 | Pending |
| SRCH-01 | Phase 2 | Pending |
| SRCH-02 | Phase 2 | Pending |
| VALID-01 | Phase 4 | Pending |
| VALID-02 | Phase 4 | Pending |
| VALID-03 | Phase 4 | Pending |
| DATA-01 | Phase 1 | Pending |
| DATA-02 | Phase 2 | Pending |
| DATA-03 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 35 total
- Mapped to phases: 35
- Unmapped: 0

---
*Requirements defined: 2026-04-09*
*Last updated: 2026-04-09 after roadmap creation*
