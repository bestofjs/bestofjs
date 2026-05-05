This is the PRD created from #371 using https://github.com/mattpocock/skills/blob/main/write-a-prd/SKILL.md

## Problem Statement

The web app loads a static `projects.json` (~2,000 projects) built once daily, queries it in-memory using `mingo`, and computes star trends per-request via `computeTrends()` on raw snapshots. This has hard limits:

- The JSON file cannot grow indefinitely — ~2k cap excludes relevant projects
- Metadata edits require a full daily rebuild before they're visible to users
- Text search is limited to what's in the JSON; the full catalog (including deprecated projects) is not searchable
- `shouldIncludeProjectInMainList()` collapses popularity, activity, and download signals into a single boolean, losing all sorting nuance

## Solution

Add two DB cache tables (`repo_trends` and `project_trends`) populated by a new daily backend task, then migrate the web app's listing and search pages to use DB-backed queries. A multi-dimensional scoring system replaces the `is_included` boolean: three dimension scores serve as sort keys, and a composite `relevance_score` acts as the quality floor (`WHERE relevance_score >= 0`).

A new `/search?q=…` route (same UI as `/projects`) backs full-catalog search via a DB `ILIKE` query with no relevance filter, so deprecated and low-relevance projects are still findable.

## User Stories

1. I want the projects list to include more than ~2,000 projects, so that relevant newer projects are not silently excluded.
2. I want the projects list to be sorted by star momentum (popularity), so that genuinely trending projects appear at the top.
3. I want to sort projects by "hot today", so that I can discover what got attention in the last 24 hours.
4. I want to sort projects by total star count, so that I can find the most established projects.
5. I want to sort projects by maintenance activity, so that I can find well-maintained projects.
6. I want to sort projects by monthly NPM downloads, so that I can find the most widely adopted packages.
7. I want to sort projects by date added, so that I can discover recently curated projects.
8. I want to filter the project list by one or more tags, so that I can browse projects in a specific domain.
9. I want to search the full catalog including deprecated projects, so that I can find a package even if it's no longer actively tracked.
10. I want deprecated projects with strong NPM adoption to remain visible in listings, so that widely-used legacy packages are still discoverable.
11. I want deprecated projects with no meaningful signals to be hidden from listings, so that the list stays relevant.
12. I want to see a "trending" label on projects with high star momentum, so that I can quickly identify hot projects.
13. I want to see a "cold" label on projects with negative star momentum, so that I know attention is declining.
14. I want to see a "frozen" label on projects with zero maintenance activity, so that I know the project is unmaintained.
15. I want project metadata changes (status changes, tag assignments) to be reflected after the next daily run, so that listings stay current.
16. I want pressing Enter on a Cmd+K search result to navigate to `/search?q=…`, so that I can see all matching projects in the full catalog.
17. I want the projects list to paginate, so that I can browse beyond the first page of results.
18. I want the `/tags` listing to continue working correctly after the migration, so that tag browsing is unaffected.
19. I want the home page trend sections (today / this week / this month) to continue working, so that the homepage experience is unchanged.

## Implementation Decisions

### New cache tables

Two new tables store pre-computed scores, refreshed daily:

**`repo_trends`** (one row per repo, repo-level signals):
- `stars`, `daily`, `weekly`, `monthly`, `quarterly`, `yearly` — raw trend deltas
- `popularity_score` — signed log-scale blend of star trends (~-100 to +100); sort key for "trending"
- `activity_score` — log2 decay from last commit + contributor bonus (0–100); sort key for "most active"

**`project_trends`** (one row per project, project-level signals):
- `package_name`, `monthly_downloads` — primary package (highest monthly downloads wins if multiple)
- `usage_score` — log10 of monthly downloads, 0–100; sort key for "most used"
- `relevance_score` — weighted blend of popularity + activity + usage with a -20 malus for `deprecated` status; used only as a `WHERE` filter, never `ORDER BY`

### Scoring formulas

- **`popularity_score`**: `sign(raw) * log10(1 + |raw| / 10) * 30` where `raw = yearly + monthly*6 + daily*180`
- **`activity_score`**: `max(0, 100 - log2(days+1) * 10) + min(10, log2(contributors) * 3)`
- **`usage_score`**: `max(0, min(100, (log10(downloads) - 2) * 20))`
- **`relevance_score`**: `popularity*0.5 + activity*0.25 + usage*0.25` (no-package variant: `popularity*0.65 + activity*0.35`), minus 20 for `deprecated`

All formulas are pure functions of their inputs. Recalculated daily; tunable without schema changes.

### Status policy

- `active`, `featured`, `promoted`: eligible for daily GitHub star tracking; included in public queries
- `deprecated`: excluded from GitHub star tracking (cost saving); `repo_trends` row is deleted daily; `relevance_score` malus of -20 applied — strong NPM usage can still clear the quality floor
- Quality floor: `WHERE relevance_score >= 0` is the only listing filter — no explicit status check in queries

### Daily backend task

New task runs alongside the existing `buildStaticApiTask` during migration. Three sequential steps with early exit on failure (previous day's data remains on failure, retried next run):

1. **Cleanup** — delete `repo_trends` rows for repos linked only to deprecated projects
2. **Pass 1 (per repo, deduplicated)** — compute trends and repo-level scores; upsert into `repo_trends`
3. **Pass 2 (per project, all including deprecated)** — resolve primary package, compute project-level scores; upsert into `project_trends`

### Web app queries

Every listing query follows the same pattern: `INNER JOIN` to both cache tables, `WHERE relevance_score >= 0`, `ORDER BY` user-chosen metric, offset-based pagination. New projects are invisible until the next daily run (acceptable: data is already daily).

Extend the existing `findProjects()` function in `packages/db` with joins to `repo_trends` and `project_trends`.

Wrap DB calls in `unstable_cache` with a ~1-hour `revalidate`.

### Sort options

| UI label      | ORDER BY                          |
|---------------|-----------------------------------|
| Trending      | `repo_trends.popularity_score DESC` |
| Hot today     | `repo_trends.daily DESC`          |
| Most stars    | `repo_trends.stars DESC`          |
| Most active   | `repo_trends.activity_score DESC` |
| Most used     | `project_trends.usage_score DESC` |
| Newest        | `projects.created_at DESC`        |

### `/search` route

New route `/search?q=…` with the same UI as `/projects`. Key difference: no `relevance_score` filter — queries the full catalog including deprecated projects. Backed by a DB `ILIKE` query. The Cmd+K palette pressing Enter navigates here.

### UI labels (render-time only, not stored)

- `popularity_score < 0` → "cold"
- `activity_score === 0` → "frozen"
- `popularity_score >= 80` → "trending"
- `usage_score >= 80 && activity_score < 20` → "widely used but unmaintained"

## Testing Decisions

A good test verifies observable behavior (query results, score values for known inputs) rather than internal implementation details (SQL structure, loop order).

**Unit tests** — scoring functions are pure functions of numeric inputs, trivial to test exhaustively:
- `computePopularityScore`: viral/healthy/stagnant/declining profiles
- `computeActivityScore`: yesterday/2 weeks/1 year/no commit date
- `computeUsageScore`: 10M/1M/100k/10k/no downloads
- `computeRelevanceScore`: with package / without package / deprecated malus

**Integration tests** — DB queries against a real test database (consistent with existing test patterns in the repo that avoid mocks):
- `findProjects()` with each sort option returns rows in the expected order
- `WHERE relevance_score >= 0` correctly excludes low-relevance projects
- Tag filtering returns only projects with all requested tags
- `/search` query returns deprecated projects that the listing excludes

## Out of Scope

- Removing `projects.json` / `projects-full.json` or the static API build
- Rewriting the legacy app data access
- Replacing the client-side preloaded Cmd+K palette dataset/filtering logic (palette stays preloaded; only the Enter navigation changes)
- Homepage trend sections (today / this week / this month) — UI and data source unchanged in this phase

## Further Notes

Both new tables are small (~200KB + ~150KB for ~3k projects). Sub-millisecond queries even without indexes, but indexes are defined on all sort columns for future scale.

Migration is incremental: the daily task and new tables can be deployed and validated before any web app page is switched over. Parity validation: deploy DB-backed branch to a Vercel preview URL and compare against production — total project counts within ~5%, top-20 overlap >80% per sort option, spot-check popular tags (react, vue, typescript).
