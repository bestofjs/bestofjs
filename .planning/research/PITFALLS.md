# Pitfalls Research

**Domain:** Static JSON + mingo to DB-backed queries with pre-computed score cache tables
**Researched:** 2026-04-09
**Confidence:** HIGH (grounded in codebase analysis of existing data flow, schema, and query patterns)

## Critical Pitfalls

### Pitfall 1: Relevant Tags Computation Breaks Silently

**What goes wrong:**
The current `getResultRelevantTags()` in `search-utils.tsx` iterates over ALL matched projects (not just the page) to count tag occurrences, then returns the top 20. This works because mingo returns the full result set in memory and pagination is a `.slice()`. When switching to DB queries with `LIMIT`/`OFFSET`, the naive approach only counts tags from the current page of results, making the "relevant tags" sidebar useless or misleading. The `/projects` page prominently displays these tags as navigation aids.

**Why it happens:**
The mingo pipeline does `find().sort().all()` returning the full array, then paginates with JS `slice()`. The `relevantTagIds` are computed from `foundProjects` (all matches), not `paginatedProjects`. Developers translating this to SQL naturally add `LIMIT`/`OFFSET` to the main query and lose access to the full result set for tag aggregation.

**How to avoid:**
Run a separate aggregation query for relevant tags: `SELECT tag_id, COUNT(*) FROM projects_to_tags WHERE project_id IN (subquery of matching project IDs without LIMIT) GROUP BY tag_id ORDER BY count DESC LIMIT 20`. This is a lightweight query on the join table and does not require fetching all project rows. Alternatively, use a CTE that computes the filtered project set once, then use it for both pagination and tag aggregation.

**Warning signs:**
- Relevant tags section shows fewer tags than expected
- Tag counts in the sidebar do not match the total project count
- Relevant tags change when navigating pages (they should be stable across pages for the same filter)

**Phase to address:**
Must be solved in the same phase as the listing query migration. This is not a follow-up -- the `/projects` page relies on relevant tags for navigation UX.

---

### Pitfall 2: Sort Field Mismatch Between Mingo Keys and DB Columns

**What goes wrong:**
The current sort options use mingo-style dot-notation keys like `{ "trends.daily": -1 }`, `{ stars: -1 }`, `{ pushed_at: -1 }`, `{ downloads: -1 }`, `{ contributor_count: -1 }`. These are property paths on the flattened `RawProject` JSON object. The DB migration must translate each of these to the correct table and column across JOINs: `stars` lives on `repos.stargazers_count`, `trends.daily` will live on `repo_trends.daily`, `downloads` on `packages.downloads` (with primary package selection), `pushed_at` on `repos.last_commit`, `contributor_count` on `repos.contributor_count`, `created_at` on `repos.created_at`, `added_at` on `projects.created_at`. Getting even one mapping wrong causes a sort option to silently return incorrect ordering.

**Why it happens:**
The flat `RawProject` shape hides the fact that data comes from 4+ tables (projects, repos, packages, snapshots/cache). Developers build the "happy path" query for star-based sorting and forget that each sort option requires a different JOIN path. The `downloads` sort is particularly tricky because it requires selecting the primary package (highest `monthlyDownloads`) per project.

**How to avoid:**
Create an explicit mapping object from sort option keys to Drizzle `orderBy` expressions. Write it alongside the sort options, not inline in the query builder. Test every sort option individually during dual-run validation. The mapping should look like:

```typescript
const sortKeyToColumn = {
  stars: desc(repos.stargazers_count),
  "trends.daily": desc(repoTrends.daily),
  "trends.weekly": desc(repoTrends.weekly),
  downloads: desc(projectTrends.monthlyDownloads), // from cache table
  pushed_at: desc(repos.last_commit),
  contributor_count: desc(repos.contributor_count),
  created_at: asc(repos.created_at),
  added_at: desc(projects.createdAt),
};
```

**Warning signs:**
- Dual-run validation shows different project ordering for the same sort key
- "Sort by downloads" returns projects with 0 downloads near the top (NULL handling)
- "Sort by daily trend" returns different top-10 than the static JSON version

**Phase to address:**
Core query building phase. Every sort option must be mapped before the listing pages can be switched over.

---

### Pitfall 3: NULL Handling in Trend and Download Columns Distorts Ranking

**What goes wrong:**
Projects with no snapshots have `NULL` trends. Projects with 0 packages have `NULL` downloads. PostgreSQL sorts NULLs as highest by default in `DESC` ordering, meaning projects with no data float to the top of "most downloads" or "trending today" lists. The mingo system avoids this because missing fields just get `undefined` which sorts to the bottom.

**Why it happens:**
The `repo_trends` and `project_trends` cache tables will have NULLable columns for daily/weekly/monthly/yearly trends and downloads. Developers write `ORDER BY daily DESC` and forget that NULL != 0 in SQL.

**How to avoid:**
Use `NULLS LAST` on all `DESC` sort clauses, or use `COALESCE(column, 0)` in the ORDER BY. Since Drizzle supports `nullsLast()` modifier, the cleanest approach is:

```typescript
desc(repoTrends.daily).nullsLast()
```

Also ensure the cache refresh task writes `0` (not NULL) for computed scores where the input data exists but yields zero. Reserve NULL for "cannot compute" (e.g., no snapshots at all).

**Warning signs:**
- Projects you have never heard of appear at the top of trend-sorted lists
- The top result has no star count or trend data displayed
- Dual-run validation shows top-N differences specifically in trend-sorted views

**Phase to address:**
Cache table schema design phase. The NULL vs 0 semantics must be decided before any data is written.

---

### Pitfall 4: Dual-Run Parity Check Compares Wrong Things

**What goes wrong:**
The dual-run validation (comparing static JSON results vs DB results) produces false positives or false negatives because the comparison does not account for: (a) the static JSON has already filtered out projects via `shouldIncludeProjectInMainList()` (cold, inactive, etc.), while the DB query uses `relevance_score` as a quality floor; (b) mingo sorts are not stable (equal-scored projects can appear in any order), so position-by-position comparison fails; (c) the static JSON is rebuilt daily and could be stale relative to real-time DB queries.

**Why it happens:**
Developers treat dual-run as "same input, compare output" but the two systems have fundamentally different filtering logic. The static JSON uses a boolean `shouldIncludeProjectInMainList()` with hardcoded thresholds (`YEARLY_STARS_THRESHOLD = 50`, `MONTHLY_DOWNLOADS_THRESHOLD = 100_000`), while the new system uses multi-dimensional scores with a relevance floor. These will not produce identical project sets.

**How to avoid:**
Define parity criteria explicitly before building the validation:
1. **Set-level parity**: Compare the sets of included project slugs, not their order. Track added/removed projects and verify each difference is explainable by the new scoring logic.
2. **Order parity within a page**: For a given sort key, compare the top-N project slugs allowing for ties. Use a tolerance window (e.g., projects with the same score can appear in any order).
3. **Count parity**: Total result counts should be within a defined tolerance (e.g., +/-5%) rather than exact.
4. **Run both against the same snapshot**: Ensure the static JSON being compared was built from the same data the DB cache was refreshed from.

**Warning signs:**
- Validation passes 100% (suspiciously perfect -- likely not testing enough)
- Validation fails on every comparison (likely comparing filtered vs unfiltered sets)
- Edge case projects (promoted, featured) consistently mismatch

**Phase to address:**
Should be designed during score/cache phase and executed during the query migration phase. The validation criteria are part of the scoring design, not an afterthought.

---

### Pitfall 5: Monorepo Sibling Star Deduplication in Score Computation

**What goes wrong:**
Multiple projects share the same repo (monorepo siblings). The `projects` table has a many-to-one relationship with `repos`. If the score computation joins projects to repos naively and sums or averages, monorepo siblings double-count star data. Or worse: when listing projects sorted by stars, all siblings of a popular monorepo appear clustered together with identical star counts, which is correct behavior but means the `repo_trends` cache must be computed per-repo (not per-project), and the join must be done carefully.

**Why it happens:**
The two-table cache design (`repo_trends` for star/activity data, `project_trends` for download data) is specifically designed to handle this, but the implementation can still go wrong if: (a) the refresh task creates `repo_trends` rows per project instead of per repo, (b) the listing query joins `repo_trends` through project instead of through repo, creating duplicates in aggregate queries, or (c) the `relevance_score` computation double-weights the repo dimension for monorepo projects.

**How to avoid:**
- `repo_trends` is keyed by `repo_id`, not `project_id`. One row per repo.
- `project_trends` is keyed by `project_id`. It stores download-based scores and the composite `relevance_score`.
- The listing query joins: `projects -> repos -> repo_trends` for star/trend sorts, and `projects -> project_trends` for download sorts.
- Write a specific test with known monorepo siblings (e.g., find 2+ projects sharing a `repoId` in the current data) verifying they get identical `repo_trends` but potentially different `project_trends`.

**Warning signs:**
- `repo_trends` table has more rows than distinct repos
- Monorepo projects show different star trends from each other
- Aggregate queries return unexpected counts when GROUP BY includes project_id

**Phase to address:**
Cache table schema and refresh task phase. This must be right before any scores are written.

---

### Pitfall 6: Primary Package Selection Creates Inconsistent Download Rankings

**What goes wrong:**
The project design doc says "Primary package = highest monthly downloads." But packages change over time -- a project's primary package today might not be the same next month. If the cache refresh task always picks the current highest-download package, historical comparisons become meaningless. Additionally, some projects have packages that are deprecated npm forks with inflated legacy download numbers (e.g., an old package name that got replaced).

**Why it happens:**
The `packages` table has a `deprecated` boolean, but the "highest downloads" heuristic does not filter deprecated packages. Also, the current `RawProject` shape has a single `downloads` field and single `npm` field, suggesting the static API already made this selection somewhere.

**How to avoid:**
- Filter out `deprecated = true` packages before selecting the primary package.
- Store the selected primary package name in `project_trends` so it is auditable.
- Accept that primary package selection is a point-in-time decision and do not try to make it historically stable. The cache refreshes daily; this is fine.
- For projects with 0 non-deprecated packages, set `usage_score = 0` and `monthlyDownloads = NULL` (not 0, since 0 means "has a package with 0 downloads").

**Warning signs:**
- A project's download rank jumps dramatically between cache refreshes
- Deprecated packages appear as the primary package for well-known projects
- Projects with multiple packages show downloads for an unexpected package name

**Phase to address:**
Cache refresh task implementation. The primary package selection logic should be a standalone, testable function.

---

### Pitfall 7: Stale Cache During Transition Creates Flickering Results

**What goes wrong:**
During the migration rollout, if the daily cache refresh task fails or runs at a different time than `buildStaticApiTask`, the DB-backed listing pages show stale data while the static JSON pages show fresh data (or vice versa). Users see different "trending today" projects depending on which code path serves them.

**Why it happens:**
The constraint says "Daily refresh task runs alongside existing `buildStaticApiTask`." But "alongside" is ambiguous -- same cron schedule? Same task? Sequential? If they run independently, clock skew or partial failures create inconsistency windows.

**How to avoid:**
- Run the cache refresh as a step within (or immediately after) `buildStaticApiTask`, not as a separate cron job. This guarantees both views are based on the same snapshot data.
- Add a `refreshed_at` timestamp to each cache table. The listing query should check that `refreshed_at` is within the last 48 hours; if not, fall back to the static JSON path.
- Log and alert on cache refresh failures. A stale cache is worse than no cache because it looks correct but is wrong.

**Warning signs:**
- `repo_trends.refreshed_at` is more than 24 hours old
- "Hot today" projects on the DB-backed path differ from the static JSON path
- Cache refresh task errors appear in logs but listings still render (no fallback triggered)

**Phase to address:**
Infrastructure/task phase. The refresh scheduling decision should be made before implementing the refresh task.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Keeping mingo sort key format in the new API | No frontend changes needed | Maintaining a translation layer forever; new sort options must be added in two places | During migration only. Refactor sort keys to DB-native format after cutover. |
| ILIKE search instead of pg_trgm | No extension installation; simpler queries | Cannot handle typos; performance degrades if catalog grows to 50k+ projects | Acceptable for v1 at 3.5k projects. Revisit if catalog exceeds 10k. |
| Computing relevance_score as a weighted sum of other scores | Simple, transparent formula | Weights are arbitrary and may need tuning; no learning from user behavior | Acceptable indefinitely for a curated catalog. Only a problem if Best of JS becomes user-driven. |
| Single `refreshed_at` per cache table (not per row) | Simpler refresh logic | Cannot do incremental refreshes for changed projects only | Acceptable at 3.5k projects (~200KB cache). Revisit above 50k projects. |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| N+1 on tag population: fetching tag names for each project in a loop | Listing page latency spikes | Single JOIN or subquery with `array_agg` for tags per project | Even at 3.5k projects if 20 per page each with 3-5 tags |
| Recomputing trends from snapshots on every request instead of using cache | Request times > 500ms, CPU spikes | This is exactly what the cache tables solve. Never compute trends in the request path. | Immediately -- snapshot JSONB parsing is expensive |
| Unindexed filter on `project_trends.relevance_score` | Sequential scan on WHERE clause | Add index on `relevance_score` column in `project_trends` | At 10k+ projects; at 3.5k the table fits in memory |
| Tag filtering via subquery without index on `projects_to_tags` | Slow tag-filtered listings | The composite PK `(project_id, tag_id)` already provides the needed index. Add a reverse index `(tag_id, project_id)` for "find projects by tag" queries. | At 3.5k projects with ~3 tags each = ~10k rows, breaks around 50k rows without reverse index |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Changing the default sort order during migration | Users bookmark URLs with implicit sort; results suddenly look different | Keep `daily` as the default sort. Document in PROJECT.md that default sort must not change during migration. |
| Different total counts between old and new system | Users see "2,100 projects" one day and "3,200 projects" the next when the DB-backed query removes the cold/inactive filter | Phase the transition: first launch with equivalent filtering, then expand scope in a separate announced change. |
| Empty trend values showing as "0" instead of being hidden | A project with no daily trend data shows "+0" which looks like "got zero stars today" vs "no data available" | Preserve the NULL vs 0 distinction through to the UI. NULL = hide the value, 0 = show "+0". |

## "Looks Done But Isn't" Checklist

- [ ] **Sort options:** All 10 sort options work and produce results matching the static JSON version (not just "by stars" which is the easiest)
- [ ] **Tag counter:** The `tag.counter` field (number of projects per tag) is computed from DB-included projects, not all projects -- the `/tags` page shows these counts
- [ ] **Relevant tags:** Relevant tags are computed from the full filtered set, not just the current page
- [ ] **Status filtering:** `deprecated` projects are excluded from all listing queries, `promoted` projects are included regardless of score, `featured` projects appear in homepage modules
- [ ] **Pagination stability:** Navigating to page 2 and back to page 1 returns the same results (requires deterministic tiebreaker in ORDER BY)
- [ ] **Empty state:** Tag pages with 0 matching projects after re-filtering show a proper empty state, not a broken page
- [ ] **lastUpdateDate:** The listing response still includes `lastUpdateDate` (used for OG image cache busting in `projects/page.tsx`)
- [ ] **Search index:** `getSearchIndex()` still returns the full dataset sorted by stars for the search palette -- this must continue working alongside DB queries
- [ ] **Featured projects:** `findRandomFeaturedProjects()` still works with the `dailyFeaturedProjects` table (it already uses DB, but the `populate` function changes)

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Wrong NULL handling in sorts | LOW | Add `NULLS LAST` to all DESC sort clauses, re-test. No data migration needed. |
| Incorrect relevant tag computation | MEDIUM | Requires adding a separate aggregation query. May need to restructure the query builder. |
| Monorepo deduplication bug in cache | MEDIUM | Fix the refresh task key, truncate and re-populate cache tables. No schema change needed if keyed correctly from the start. |
| Dual-run validation designed incorrectly | LOW | Redefine parity criteria, re-run. No production impact since validation is a development tool. |
| Stale cache with no fallback | HIGH | If cache refresh has been failing silently, listings may have been wrong for days. Requires adding monitoring, a fallback path, and re-running the refresh. |
| Sort field mapping wrong for one sort option | LOW | Fix the mapping, deploy. Users on that sort see correct results immediately. |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Relevant tags computation | Query migration phase | Compare relevant tags output for 10 different tag filter combinations against mingo results |
| Sort field mismatch | Query migration phase | Automated test: for each sort key, compare top-20 slugs between static and DB paths |
| NULL handling in sorts | Cache schema design phase | Review all column definitions; write test asserting NULL-trend projects never appear in top-10 of any sort |
| Dual-run parity criteria | Score/cache design phase | Document parity criteria before building validation tooling |
| Monorepo star deduplication | Cache refresh task phase | Query for projects sharing a repoId; verify repo_trends has exactly N distinct repo rows |
| Primary package selection | Cache refresh task phase | Test with a known multi-package project; verify deprecated packages are excluded |
| Stale cache during transition | Infrastructure/task phase | Monitor `refreshed_at` timestamp; alert if older than 36 hours |

## Sources

- Codebase analysis: `apps/web/src/server/api-projects.tsx` (mingo query pipeline, relevant tags computation)
- Codebase analysis: `apps/web/src/server/api-utils.tsx` (tag counter computation, populate function)
- Codebase analysis: `apps/web/src/components/project-list/sort-order-options.ts` (all 10 sort keys and their mingo field paths)
- Codebase analysis: `apps/web/src/lib/global.d.ts` (RawProject shape showing flat structure hiding multi-table origin)
- Codebase analysis: `apps/backend/src/tasks/build-static-api.task.ts` (shouldIncludeProjectInMainList filter logic, trend computation in build pipeline)
- Codebase analysis: `packages/db/src/schema/` (repos, projects, packages, snapshots schema showing table relationships)
- Codebase analysis: `packages/db/src/snapshots/compute-trends.ts` (current trend computation from snapshot JSONB)
- Project context: `.planning/PROJECT.md` (two-table cache design, scoring system, primary package selection)

---
*Pitfalls research for: Static JSON + mingo to DB-backed queries with pre-computed score cache tables*
*Researched: 2026-04-09*
