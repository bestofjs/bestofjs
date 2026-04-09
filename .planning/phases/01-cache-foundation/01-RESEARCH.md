# Phase 1: Cache Foundation - Research

**Researched:** 2026-04-09
**Domain:** Drizzle ORM schema, scoring algorithms, daily task orchestration
**Confidence:** HIGH

## Summary

Phase 1 creates two cache tables (`repo_trends` and `project_trends`) with Drizzle schema definitions, implements four scoring functions as pure TypeScript functions, and builds a daily refresh task that populates both tables via upserts. The phase builds entirely on existing patterns in the codebase: Drizzle `pgTable()` for schema, `createTask()` for the task, `computeTrends()` + `flattenSnapshots()` for trend computation, and `db.insert().onConflictDoUpdate()` for upserts.

The codebase already has all the building blocks. The repo processor (`RepoProcessor`) demonstrates how to iterate repos with joins to projects and snapshots. The `buildStaticApiTask` shows the exact pattern for filtering by project status and computing trends per repo. The scoring formulas are fully specified in CONTEXT.md with exact mathematical definitions -- implementation is straightforward pure function work.

**Primary recommendation:** Build this as three logical units: (1) schema + migration, (2) scoring pure functions with tests, (3) refresh task that wires them together. No new dependencies needed.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Two separate cache tables: `repo_trends` (keyed by `repo_id`) and `project_trends` (keyed by `project_id`)
- `repo_trends` stores: stars, daily/weekly/monthly/quarterly/yearly trend deltas, popularity_score (signed), activity_score (0-100)
- `project_trends` stores: package_name, monthly_downloads, usage_score (0-100), relevance_score (signed)
- All score columns are INTEGER NOT NULL DEFAULT 0; trend delta columns are nullable INTEGER (NULL = cannot compute, 0 = computed but zero)
- Both tables use TEXT PRIMARY KEY with foreign key references and ON DELETE CASCADE
- Descending indexes on all sort-relevant columns; trend columns use NULLS LAST in indexes
- Scoring formulas: `popularity_score` = signed log scale of blended star trends; `activity_score` = log2 decay from last commit + contributor bonus; `usage_score` = log10 of monthly downloads clamped 0-100; `relevance_score` = weighted blend with adjusted weights for no-package projects
- Two-pass refresh: Pass 1 per-repo (deduplicated), Pass 2 per-project
- Primary package = highest monthlyDownloads
- Deprecated projects excluded from both passes
- Upsert pattern: `db.insert().values().onConflictDoUpdate()`

### Claude's Discretion
- Drizzle migration file naming and structure
- Whether to batch upserts or process one-by-one (performance choice for ~3.5K rows)
- Error handling within the refresh task (retry strategy, partial failure handling)
- Whether to log score distribution stats after refresh for tuning visibility
- Test structure and fixtures for scoring functions

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CACHE-01 | `repo_trends` table stores per-repo star counts, trend deltas, popularity_score, activity_score | Schema definition pattern verified from existing `repos.ts`, `packages.ts`; Drizzle 0.44.5 supports `.desc().nullsLast()` on index columns |
| CACHE-02 | `project_trends` table stores per-project primary package name, monthly downloads, usage_score, relevance_score | Same schema patterns; FK reference to `projects.id` with ON DELETE CASCADE matches existing `packages.ts` |
| CACHE-03 | Daily refresh task computes and upserts all cache table data | `createTask()` pattern in `task-runner.ts`; task registration in `cli.ts`; upsert via `onConflictDoUpdate()` confirmed in `build-static-api.task.ts` and `update-bundle-size.task.ts` |
| CACHE-04 | Refresh task deduplicates repo-level computation for monorepo siblings | `RepoProcessor.getAllItemsIds()` already queries distinct repos; `findRepoById()` includes related projects. Pass 1 iterates repos, not projects |
| CACHE-05 | Refresh task resolves primary package as highest monthly downloads | `packages` table has `monthlyDownloads` (column: `downloads`) and `projectId`; SQL `ORDER BY downloads DESC LIMIT 1` per project or in-memory max from project's packages array |
| SCORE-01 | popularity_score computed as signed log scale of blended star trends | Pure function; `computeTrends()` returns `{daily, weekly, monthly, quarterly, yearly}` -- all inputs available |
| SCORE-02 | activity_score computed as log2 decay from last commit with contributor bonus | `repos.last_commit` and `repos.contributor_count` columns exist; pure function over repo data |
| SCORE-03 | usage_score computed as log10 of monthly downloads | `packages.monthlyDownloads` column exists; pure function, 0 when no package |
| SCORE-04 | relevance_score computed as weighted blend with adjusted weights for no-package projects | Depends on popularity_score, activity_score, usage_score outputs; pure function |
| DATA-01 | Only repos linked to active/featured/promoted projects included in daily star tracking | `PROJECT_STATUSES` constant exists; filter: `WHERE p.status IN ('active', 'featured', 'promoted')` |
| DATA-03 | `repo_trends` keyed by `repo_id` (not `project_id`) for monorepo siblings | Schema design uses `text("repo_id").primaryKey().references(() => repos.id)` |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| drizzle-orm | 0.44.5 | Schema definitions, query builder, upserts | Already installed; all existing schema uses `pgTable()` from this version |
| drizzle-kit | 0.31.4 | Migration generation (`pnpm generate`) and application (`pnpm migrate`) | Already installed; 10 existing migrations in `packages/db/drizzle/` |
| bun:test | (bundled) | Unit tests for scoring functions | Already used in `packages/db/src/snapshots/snapshots.test.ts` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tiny-invariant | 1.3.3 | Assert preconditions in scoring functions | Already a dependency of `@repo/db` |
| consola | (current) | Logger in task context | Already provided via `TaskContext.logger` |
| es-toolkit | 1.39.10 | `orderBy`, `maxBy` for primary package resolution | Already a dependency of `@repo/db` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Individual upserts | Batch INSERT with VALUES array | Batch is faster for 3.5K rows; individual is simpler for error isolation. Recommend batch with chunking (100-500 rows per batch) |
| Application-side scoring | INSERT...SELECT with SQL math | SQL-side avoids round-trips but scoring formulas are complex and harder to test. Keep as pure TS functions for testability |

**Installation:**
```bash
# No new packages needed -- everything is already installed
```

## Architecture Patterns

### Recommended Project Structure
```
packages/db/src/
  schema/
    repo-trends.ts          # NEW: pgTable + relations + indexes
    project-trends.ts       # NEW: pgTable + relations + indexes
    index.ts                # MODIFIED: add two new exports
  scores/                   # NEW: pure scoring functions
    popularity.ts           # popularityScore(trends) -> number
    activity.ts             # activityScore(lastCommit, contributors) -> number
    usage.ts                # usageScore(monthlyDownloads) -> number
    relevance.ts            # relevanceScore(pop, act, usage, hasPackage) -> number
    index.ts                # barrel export

apps/backend/src/
  tasks/
    refresh-cache.task.ts   # NEW: daily refresh task
  cli.ts                    # MODIFIED: register new task
```

### Pattern 1: Schema Definition (matching existing conventions)
**What:** Define cache tables using exact same patterns as `repos.ts`, `packages.ts`, `daily-featured-projects.ts`
**When to use:** Both new schema files
**Example:**
```typescript
// packages/db/src/schema/repo-trends.ts
import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { repos } from "./repos";

export const repoTrends = pgTable(
  "repo_trends",
  {
    repoId: text("repo_id")
      .primaryKey()
      .references(() => repos.id, { onDelete: "cascade" }),
    stars: integer("stars"),
    daily: integer("daily"),
    weekly: integer("weekly"),
    monthly: integer("monthly"),
    quarterly: integer("quarterly"),
    yearly: integer("yearly"),
    popularityScore: integer("popularity_score").notNull().default(0),
    activityScore: integer("activity_score").notNull().default(0),
    refreshedAt: timestamp("refreshed_at").notNull().defaultNow(),
  },
  (table) => [
    index("repo_trends_stars_idx").on(table.stars.desc()),
    index("repo_trends_daily_idx").on(table.daily.desc().nullsLast()),
    index("repo_trends_weekly_idx").on(table.weekly.desc().nullsLast()),
    index("repo_trends_monthly_idx").on(table.monthly.desc().nullsLast()),
    index("repo_trends_quarterly_idx").on(table.quarterly.desc().nullsLast()),
    index("repo_trends_yearly_idx").on(table.yearly.desc().nullsLast()),
    index("repo_trends_popularity_idx").on(table.popularityScore.desc()),
    index("repo_trends_activity_idx").on(table.activityScore.desc()),
  ],
);

export const repoTrendsRelations = relations(repoTrends, ({ one }) => ({
  repo: one(repos, { fields: [repoTrends.repoId], references: [repos.id] }),
}));
```

### Pattern 2: Upsert (matching existing codebase pattern)
**What:** INSERT ... ON CONFLICT DO UPDATE for atomic cache refresh
**When to use:** Both Pass 1 (repo_trends) and Pass 2 (project_trends)
**Example:**
```typescript
// Source: existing pattern in build-static-api.task.ts:198 and update-bundle-size.task.ts:63
await db
  .insert(schema.repoTrends)
  .values({
    repoId: repo.id,
    stars: repo.stars ?? 0,
    daily: trends.daily ?? null,
    weekly: trends.weekly ?? null,
    monthly: trends.monthly ?? null,
    quarterly: trends.quarterly ?? null,
    yearly: trends.yearly ?? null,
    popularityScore: computePopularityScore(trends),
    activityScore: computeActivityScore(repo.last_commit, repo.contributor_count),
    refreshedAt: new Date(),
  })
  .onConflictDoUpdate({
    target: schema.repoTrends.repoId,
    set: {
      stars: repo.stars ?? 0,
      daily: trends.daily ?? null,
      // ... all other columns
      refreshedAt: new Date(),
    },
  });
```

### Pattern 3: Task Creation (matching existing pattern)
**What:** Use `createTask()` factory and register in `cli.ts`
**When to use:** The refresh-cache task
**Example:**
```typescript
// apps/backend/src/tasks/refresh-cache.task.ts
import { createTask } from "@/task-runner";

export const refreshCacheTask = createTask({
  name: "refresh-cache",
  description: "Refresh repo_trends and project_trends cache tables",
  run: async ({ db, logger }) => {
    // Pass 1: repo trends (deduplicated)
    // Pass 2: project trends
    return { data: null, meta: { repos: repoCount, projects: projectCount } };
  },
});
```

### Pattern 4: Pure Scoring Functions
**What:** Each score formula as an isolated pure function for testability
**When to use:** All four scoring functions
**Example:**
```typescript
// packages/db/src/scores/popularity.ts
type TrendDeltas = {
  daily?: number | null;
  monthly?: number | null;
  yearly?: number | null;
};

export function computePopularityScore(trends: TrendDeltas): number {
  const daily = trends.daily ?? 0;
  const monthly = trends.monthly ?? 0;
  const yearly = trends.yearly ?? 0;
  const raw = yearly + monthly * 6 + daily * 180;
  return Math.round(Math.sign(raw) * Math.log10(1 + Math.abs(raw) / 10) * 30);
}
```

### Anti-Patterns to Avoid
- **One upsert per row in a loop with await:** Use batched inserts (chunk into arrays of 100-500 and upsert each batch). Drizzle supports `.values([...array])` for multi-row inserts.
- **Computing trends per project instead of per repo:** Monorepo siblings share a repo. `repo_trends` is keyed by `repo_id`. Compute trends once per repo, not once per project.
- **Querying snapshots inside the per-repo loop:** The existing `RepoProcessor.getItemById()` fetches snapshots eagerly. For the refresh task, consider a single query that fetches all eligible repos with their snapshots in one go, to reduce N+1 queries.
- **Nullable score columns:** CONTEXT.md specifies scores as `INTEGER NOT NULL DEFAULT 0`. Trend deltas are nullable (NULL = insufficient data). Do not confuse the two.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Star trend deltas | Custom snapshot diff logic | `computeTrends(flattenSnapshots())` | Already handles edge cases: missing days, exact/approximate matching, daily delta interpolation from 2-day gaps |
| Task orchestration | Custom CLI / cron wrapper | `createTask()` + register in `cli.ts` | Gets logging, error handling, concurrency control, dry-run mode for free |
| Snapshot flattening | Manual JSONB extraction | `flattenSnapshots()` from `project-helpers.ts` | Handles the nested `{year, months: [{month, snapshots: [{day, stars}]}]}` JSONB structure correctly |
| Migration files | Hand-written SQL | `pnpm --filter @repo/db generate` | Drizzle Kit reads schema files and generates correct migration SQL with proper index syntax |

**Key insight:** The entire trend computation pipeline (snapshot flattening + delta calculation) is already battle-tested. The scoring functions are the only genuinely new logic in this phase.

## Common Pitfalls

### Pitfall 1: Monorepo Deduplication Failure
**What goes wrong:** Multiple projects sharing a repo cause duplicate `repo_trends` rows or redundant computation
**Why it happens:** Iterating projects instead of repos for Pass 1
**How to avoid:** Pass 1 queries `SELECT DISTINCT r.id FROM repos r JOIN projects p ON p.repoId = r.id WHERE p.status IN (...)`. This is exactly what `RepoProcessor.getAllItemsIds()` does (it GROUP BY repos.id after left join)
**Warning signs:** `repo_trends` row count exceeds distinct repo count

### Pitfall 2: NULL vs 0 Confusion in Trend Deltas
**What goes wrong:** Sorting treats NULL and 0 the same, or NULL projects appear at the top of descending sorts
**Why it happens:** Not distinguishing "no data available" (NULL) from "data shows zero change" (0)
**How to avoid:** Schema uses nullable `integer()` for trend columns (no `.notNull()`). Indexes use `.nullsLast()`. In application code, `computeTrends()` already returns `undefined` for missing data -- map `undefined` to SQL `NULL`
**Warning signs:** Projects with no snapshots sorting above projects with actual zero trends

### Pitfall 3: Primary Package Resolution Picks Wrong Package
**What goes wrong:** `getPackageData()` in `project-helpers.ts` picks `project.packages[0]` (first package), not highest downloads
**Why it happens:** Using existing helper instead of implementing the CONTEXT.md requirement
**How to avoid:** For the refresh task, explicitly select `maxBy(project.packages, p => p.monthlyDownloads)` or SQL `ORDER BY downloads DESC LIMIT 1`. Do NOT reuse `getPackageData()` which picks `[0]`
**Warning signs:** Projects with multiple packages showing the wrong npm name in `project_trends`

### Pitfall 4: Snapshot Sorting Assumption
**What goes wrong:** `computeTrends()` produces wrong deltas
**Why it happens:** `computeTrends()` calls `snapshots.reverse()` internally, expecting ascending year order input. If snapshots are fetched in wrong order, results are inverted
**How to avoid:** The existing `findRepoById()` already orders snapshots `asc(schema.snapshots.year)`. Ensure the refresh task query does the same. The `snapshotsSchema.parse()` validates the JSONB structure
**Warning signs:** Negative daily deltas for trending projects, or all deltas being undefined

### Pitfall 5: Missing Task Return Type
**What goes wrong:** TypeScript errors when task does not return `{ data, meta }` structure
**Why it happens:** `Task.run` must return `Promise<{ data: unknown; meta: MetaResult }>` -- see `task-types.ts` line 20-25
**How to avoid:** Always return `{ data: null, meta: { repos: N, projects: N } }` or similar. The meta object values must be `boolean | number | undefined` (see `utils.ts` `MetaValue` type)

### Pitfall 6: Batch Upsert with Drizzle
**What goes wrong:** Drizzle's `onConflictDoUpdate()` with multi-row `.values([...])` requires the `set` clause to reference the excluded row, not static values
**Why it happens:** The `set` object with static values only uses the last row's data
**How to avoid:** For batch upserts, use `sql` template to reference excluded values: `set: { stars: sql`excluded.stars` }`. Alternatively, process rows individually if the dataset is small (~3.5K rows, each upsert is fast)
**Warning signs:** All rows getting the same values after batch upsert

## Code Examples

### Verified: computeTrends() Input/Output
```typescript
// Source: packages/db/src/snapshots/compute-trends.ts
// Input: Array of {year, month, day, stars} sorted ascending by year
// Output: { daily: number|undefined, weekly: number|undefined, monthly: number|undefined,
//           quarterly: number|undefined, yearly: number|undefined }

import { computeTrends } from "@repo/db/snapshots";
import { flattenSnapshots } from "@repo/db/projects";

// snapshots are fetched as OneYearSnapshots[] from DB
const flat = flattenSnapshots(repo.snapshots); // [{year, month, day, stars}, ...]
const trends = computeTrends(flat); // {daily: 5, weekly: 30, monthly: 120, ...}
```

### Verified: createTask() Pattern
```typescript
// Source: apps/backend/src/task-runner.ts:18-39
// Task receives: { db, logger, dryRun, processProjects, processRepos, saveJSON, readJSON }
// Task must return: { data: unknown, meta: { [key: string]: boolean | number | undefined } }
export const myTask = createTask({
  name: "task-name",
  description: "...",
  run: async ({ db, logger }) => {
    // ... work
    return { data: null, meta: { processed: 42 } };
  },
});
```

### Verified: Upsert Pattern
```typescript
// Source: apps/backend/src/tasks/build-static-api.task.ts:196-201
await db
  .insert(schema.dailyFeaturedProjects)
  .values({ day, projectSlugs })
  .onConflictDoUpdate({
    target: schema.dailyFeaturedProjects.day,
    set: { projectSlugs, updatedAt: new Date() },
  });
```

### Verified: Status Filtering
```typescript
// Source: apps/backend/src/tasks/build-static-api.task.ts:31
// For exclusion: notInArray(schema.projects.status, ["deprecated", "hidden"])
// For inclusion (CONTEXT.md requirement): inArray(schema.projects.status, ["active", "featured", "promoted"])
import { inArray } from "@repo/db/drizzle";
```

### Verified: Task Registration in CLI
```typescript
// Source: apps/backend/src/cli.ts:26-43
// Import the task, add to the commands array
import { refreshCacheTask } from "./tasks/refresh-cache.task";
const commands = [
  // ... existing tasks
  refreshCacheTask,
].map(getCommand);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `getPackageData()` picks first package | Primary package = max monthly downloads | This phase | Must implement new selection logic, not reuse existing helper |
| `shouldIncludeProjectInMainList()` in static API | `relevance_score` threshold in DB | This phase | Score-based inclusion replaces ad-hoc boolean checks |
| Trends computed on-the-fly per request | Pre-computed in cache tables, refreshed daily | This phase | Eliminates snapshot processing at request time |

**Deprecated/outdated:**
- `getPackageData()` picks `packages[0]` -- do not use for primary package resolution in cache; use explicit max-by-downloads logic instead

## Open Questions

1. **Batch size for upserts**
   - What we know: ~3,500 projects, ~3,000 distinct repos. Individual upserts work but are slower. Batch upserts with `excluded` references are more complex.
   - What's unclear: Whether the Drizzle ORM `onConflictDoUpdate` with multi-row values properly supports `sql\`excluded.column\`` in the `set` clause at version 0.44.5
   - Recommendation: Start with individual upserts (simpler, still fast at this scale -- ~3.5K individual INSERTs take seconds on Postgres). Optimize to batch only if refresh takes >30 seconds.

2. **Score rounding strategy**
   - What we know: Formulas produce floats; schema uses INTEGER columns
   - What's unclear: Whether to use `Math.round()`, `Math.floor()`, or `Math.trunc()`
   - Recommendation: Use `Math.round()` consistently for all scores. The formulas are tunable anyway.

3. **Refresh task execution context**
   - What we know: Tasks receive `{ db, logger, processProjects, processRepos, ... }` via `TaskContext`
   - What's unclear: Whether to use the existing `processRepos` iterator (which fetches each repo individually) or write a custom bulk query
   - Recommendation: Use `processRepos` for Pass 1 (it already handles deduplication, error isolation, and logging) with a custom `where` clause for status filtering. For Pass 2, use `processProjects` with status filter. This reuses existing infrastructure and gets error handling for free.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | bun:test (bundled with Bun runtime) |
| Config file | None needed -- bun:test works out of the box |
| Quick run command | `cd packages/db && bun test src/scores/` |
| Full suite command | `cd packages/db && bun test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SCORE-01 | popularity_score formula correctness | unit | `cd packages/db && bun test src/scores/popularity.test.ts` | Wave 0 |
| SCORE-02 | activity_score formula correctness | unit | `cd packages/db && bun test src/scores/activity.test.ts` | Wave 0 |
| SCORE-03 | usage_score formula correctness | unit | `cd packages/db && bun test src/scores/usage.test.ts` | Wave 0 |
| SCORE-04 | relevance_score weighted blend + no-package adjustment | unit | `cd packages/db && bun test src/scores/relevance.test.ts` | Wave 0 |
| CACHE-04 | Monorepo dedup (one repo_trends row per repo) | integration | manual -- verify row count after refresh | manual-only |
| CACHE-05 | Primary package = max downloads | unit | `cd packages/db && bun test src/scores/primary-package.test.ts` | Wave 0 |
| DATA-01 | Deprecated repos excluded | integration | manual -- verify deprecated repos absent from repo_trends | manual-only |

### Sampling Rate
- **Per task commit:** `cd packages/db && bun test src/scores/`
- **Per wave merge:** `cd packages/db && bun test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `packages/db/src/scores/popularity.test.ts` -- covers SCORE-01
- [ ] `packages/db/src/scores/activity.test.ts` -- covers SCORE-02
- [ ] `packages/db/src/scores/usage.test.ts` -- covers SCORE-03
- [ ] `packages/db/src/scores/relevance.test.ts` -- covers SCORE-04
- [ ] `packages/db/src/scores/primary-package.test.ts` -- covers CACHE-05

## Sources

### Primary (HIGH confidence)
- Codebase: `packages/db/src/schema/repos.ts`, `projects.ts`, `packages.ts`, `snapshots.ts` -- existing schema patterns
- Codebase: `packages/db/src/snapshots/compute-trends.ts` -- trend computation logic
- Codebase: `packages/db/src/projects/project-helpers.ts` -- `flattenSnapshots()`, `getPackageData()`
- Codebase: `apps/backend/src/task-runner.ts` -- `createTask()` factory pattern
- Codebase: `apps/backend/src/cli.ts` -- task registration pattern
- Codebase: `apps/backend/src/tasks/build-static-api.task.ts` -- upsert pattern, status filtering, trend computation flow
- Codebase: `apps/backend/src/iteration-helpers/` -- `RepoProcessor`, `ProjectProcessor`, `ItemProcessor` patterns
- [Drizzle ORM indexes docs](https://orm.drizzle.team/docs/indexes-constraints) -- `.desc()`, `.nullsLast()` on index columns (since v0.31.0)
- `.planning/research/STACK.md` -- technology stack decisions

### Secondary (MEDIUM confidence)
- [Drizzle ORM v0.31.0 release notes](https://orm.drizzle.team/docs/latest-releases/drizzle-orm-v0310) -- new index API with desc/nullsLast support
- [Drizzle index issue #1981](https://github.com/drizzle-team/drizzle-orm/issues/1981) -- confirms desc/nullsLast generate correct SQL in migrations since v0.31.0

### Tertiary (LOW confidence)
- Batch upsert with `excluded` references in Drizzle 0.44.5 -- not verified with official docs; recommend individual upserts as safe default

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- entirely existing codebase dependencies, no new packages
- Architecture: HIGH -- follows established patterns verbatim (`createTask`, `pgTable`, `onConflictDoUpdate`)
- Scoring formulas: HIGH -- fully specified in CONTEXT.md, pure functions with no external dependencies
- Pitfalls: HIGH -- identified from direct codebase analysis (snapshot ordering, package selection, monorepo dedup)
- Index syntax: HIGH -- Drizzle `.desc().nullsLast()` confirmed available since v0.31.0, project uses v0.44.5

**Research date:** 2026-04-09
**Valid until:** 2026-05-09 (stable domain -- Drizzle ORM 0.44.x, no breaking changes expected)
