# Phase 1: Cache Foundation - Research

**Researched:** 2026-04-09 (updated)
**Domain:** Drizzle ORM schema design, pure scoring functions, backend task orchestration
**Confidence:** HIGH

## Summary

Phase 1 introduces two cache tables (`repo_trends`, `project_trends`), five pure scoring/resolution functions in a zero-dependency `scores/` module, and a daily refresh task that orchestrates population of both tables. The codebase is a Turborepo monorepo using Drizzle ORM 0.44.5 with PostgreSQL (Vercel Postgres/Neon), `bun:test` for unit testing, and a CLI-based task runner in `apps/backend`.

All architectural decisions are locked via CONTEXT.md and MODULE-BOUNDARIES.md. The scoring formulas, schema column types, import rules, and function signatures are fully specified. The `scores/` module is a zero-dependency leaf: no project imports, no drizzle-orm, no schema imports. Each scoring function defines its own local input types via structural typing. Research focused on verifying how to implement these decisions within the existing codebase patterns, identifying integration points, and cataloguing pitfalls.

**Primary recommendation:** Implement in dependency order -- schema files first (leaf), then scores module (leaf, zero deps), then refresh task (orchestrator). Each layer is independently testable before the next begins.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Two separate cache tables: `repo_trends` (keyed by `repo_id`) and `project_trends` (keyed by `project_id`)
- `repo_trends` stores: stars, daily/weekly/monthly/quarterly/yearly trend deltas, popularity_score (signed), activity_score (0-100)
- `project_trends` stores: package_name, monthly_downloads, usage_score (0-100), relevance_score (signed)
- All score columns are INTEGER NOT NULL DEFAULT 0; trend delta columns are nullable INTEGER (NULL = cannot compute, 0 = computed but zero)
- Both tables use TEXT PRIMARY KEY with foreign key references and ON DELETE CASCADE
- Descending indexes on all sort-relevant columns; trend columns use NULLS LAST in indexes
- Scoring formulas fully specified: popularity = signed log scale of blended star trends; activity = log2 decay from last commit + contributor bonus; usage = log10 of monthly downloads clamped 0-100; relevance = weighted blend with adjusted weights for no-package projects
- Daily refresh task using `createTask()` pattern with two-pass approach (Pass 1: per-repo, Pass 2: per-project)
- Deprecated project repos excluded from both passes
- `scores/` is a zero-dependency leaf -- no project imports, no drizzle-orm, no schema imports
- Structural typing over shared types: each scoring function defines its own local input types
- Schema modules import only FK target schemas (`repos.ts`, `projects.ts`), nothing else
- `resolvePrimaryPackage` lives in `scores/primary-package.ts` (not in the refresh task)
- Function signatures: `computePopularityScore(trends: TrendDeltas)`, `computeActivityScore(lastCommit, contributorCount, referenceDate?)`, `computeUsageScore(monthlyDownloads)`, `computeRelevanceScore(popularityScore, activityScore, usageScore, hasPackage)`, `resolvePrimaryPackage(packages: PackageInfo[])`
- One new package.json export: `"./scores": "./src/scores/index.ts"`
- Schema tables added to existing barrel (`schema/index.ts`)
- Import rules enforced per MODULE-BOUNDARIES.md Section 4

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
| CACHE-01 | `repo_trends` table stores per-repo star counts, trend deltas, popularity_score, activity_score | Schema pattern verified: `pgTable()` with `text()` PK, `integer()` columns, FK via `.references()`. Existing `repos.ts` and `daily-featured-projects.ts` confirm patterns. Drizzle 0.44.5 supports `.desc().nullsLast()` on index columns |
| CACHE-02 | `project_trends` table stores per-project primary package name, monthly downloads, usage_score, relevance_score | Same schema pattern. FK to `projects.id` with ON DELETE CASCADE matches existing `packages.ts` pattern |
| CACHE-03 | Daily refresh task computes and upserts all cache table data | `createTask()` factory at `apps/backend/src/task-runner.ts` verified. Task context provides `{ db, logger }`. Upsert pattern: `db.insert().values().onConflictDoUpdate()` confirmed in `build-static-api.task.ts` |
| CACHE-04 | Refresh task deduplicates repo-level computation for monorepo siblings | `RepoProcessor` in `iteration-helpers/repo-processor.ts` shows how to query distinct repos with project joins. Pass 1 queries distinct repos, builds in-memory Map for Pass 2 |
| CACHE-05 | Refresh task resolves primary package as highest monthly downloads | `packages` table has `monthlyDownloads` column (`integer("downloads")`). `resolvePrimaryPackage` is a pure function in `scores/primary-package.ts` per MODULE-BOUNDARIES.md |
| SCORE-01 | `popularity_score` as signed log scale of blended star trends | Pure function, formula locked. `computeTrends()` output provides daily/weekly/monthly/quarterly/yearly deltas matching local `TrendDeltas` type |
| SCORE-02 | `activity_score` as log2 decay from last commit with contributor bonus | Pure function. `repos` table has `last_commit` (timestamp) and `contributor_count` (integer) columns |
| SCORE-03 | `usage_score` as log10 of monthly downloads | Pure function. `packages.monthlyDownloads` is the data source |
| SCORE-04 | `relevance_score` as weighted blend with adjusted weights for no-package projects | Pure function taking three scores + `hasPackage` boolean |
| DATA-01 | Only repos linked to active/featured/promoted projects included | `PROJECT_STATUSES` constant exists at `packages/db/src/constants.ts`. Filter: `WHERE status IN ('active', 'featured', 'promoted')` |
| DATA-03 | `repo_trends` keyed by `repo_id` not `project_id` | Text PK referencing `repos.id`. One row per repo regardless of how many projects share it |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| drizzle-orm | ^0.44.5 | Schema definitions, queries, upserts | Already used throughout `packages/db` |
| drizzle-kit | ^0.31.4 | Migration generation | Already configured with `drizzle.config.ts` |
| bun:test | built-in | Unit testing for scoring functions | Already used in `packages/db/src/snapshots/*.test.ts` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| es-toolkit | ^1.39.10 | Utility functions | Already a dependency of `@repo/db` |
| consola | existing | Task logging | Provided via `TaskContext.logger` |
| tiny-invariant | ^1.3.3 | Runtime assertions | Already used in `compute-trends.ts` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Individual upserts | Batch INSERT with `sql.raw('excluded.column')` | Batch is faster but more complex; at ~3.5K rows individual is acceptable. Optimize later if needed |
| Application-side scoring | INSERT...SELECT with SQL math | SQL avoids round-trips but log/sign formulas are harder to test. Keep as pure TS functions |
| `processRepos` iteration helper | Direct SQL query in refresh task | Direct query is simpler for bulk operation -- no need for concurrency/throttle/skip options |

**Installation:**
```bash
# No new packages needed -- everything is already installed
```

## Architecture Patterns

### Recommended Project Structure
```
packages/db/src/
  schema/
    repo-trends.ts          # NEW - pgTable + relations + indexes
    project-trends.ts       # NEW - pgTable + relations + indexes
    index.ts                # MODIFIED - add 2 re-exports
  scores/                   # NEW - ZERO-DEPENDENCY LEAF
    popularity.ts           # computePopularityScore (local TrendDeltas type)
    activity.ts             # computeActivityScore (no imports)
    usage.ts                # computeUsageScore (no imports)
    relevance.ts            # computeRelevanceScore (no imports)
    primary-package.ts      # resolvePrimaryPackage (local PackageInfo type)
    index.ts                # barrel re-export

packages/db/package.json    # MODIFIED - add "./scores" export

apps/backend/src/
  tasks/
    refresh-cache.task.ts   # NEW - daily refresh orchestrator
  cli.ts                    # MODIFIED - register new task
```

### Pattern 1: Drizzle Schema Definition (from existing codebase)
**What:** Define pgTable with typed columns, FK references, and indexes
**When to use:** Both new cache table schemas
**Example:**
```typescript
// Source: Verified from packages/db/src/schema/repos.ts, daily-featured-projects.ts
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

### Pattern 2: Zero-Dependency Scoring Function with Local Types (from MODULE-BOUNDARIES.md)
**What:** Pure function defining its own input type -- NO imports from project codebase
**When to use:** All five functions in `scores/`
**Critical constraint:** These files CANNOT import from `schema/*`, `drizzle-orm`, `snapshots/*`, `projects/*`, `db`, or `constants`
**Example:**
```typescript
// packages/db/src/scores/popularity.ts
// ZERO IMPORTS from project codebase

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

### Pattern 3: Primary Package Resolution (pure function in scores/)
**What:** `resolvePrimaryPackage` lives in `scores/primary-package.ts` with local `PackageInfo` type
**When to use:** Called by refresh task, NOT by schema modules
**Critical constraint:** This function lives in `scores/`, not in the refresh task
**Example:**
```typescript
// packages/db/src/scores/primary-package.ts
// ZERO IMPORTS from project codebase

type PackageInfo = {
  name: string;
  monthlyDownloads: number | null;
};

export function resolvePrimaryPackage(
  packages: PackageInfo[],
): PackageInfo | null {
  if (packages.length === 0) return null;
  return packages.reduce<PackageInfo | null>((best, pkg) => {
    if (!best) return pkg;
    return (pkg.monthlyDownloads ?? 0) > (best.monthlyDownloads ?? 0)
      ? pkg
      : best;
  }, null);
}
```

### Pattern 4: Task Creation and Registration (from existing codebase)
**What:** Create task via `createTask()`, register in `cli.ts`
**When to use:** The refresh-cache task
**Example:**
```typescript
// Source: apps/backend/src/task-runner.ts:18-39
import { db, schema } from "@repo/db";
import { inArray, eq, asc } from "@repo/db/drizzle";
import { flattenSnapshots } from "@repo/db/projects";
import { computeTrends } from "@repo/db/snapshots";
import {
  computePopularityScore,
  computeActivityScore,
  computeUsageScore,
  computeRelevanceScore,
  resolvePrimaryPackage,
} from "@repo/db/scores";
import { createTask } from "@/task-runner";

export const refreshCacheTask = createTask({
  name: "refresh-cache",
  description: "Refresh repo_trends and project_trends cache tables",
  run: async ({ db, logger }) => {
    // ... two-pass orchestration
    return { data: null, meta: { repos: repoCount, projects: projectCount } };
  },
});
```

### Pattern 5: Upsert with onConflictDoUpdate (from existing codebase)
**What:** Insert-or-update using Drizzle's conflict resolution
**When to use:** Upserting into both cache tables
**Example:**
```typescript
// Source: apps/backend/src/tasks/build-static-api.task.ts lines 196-200
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
    activityScore: computeActivityScore(repo.last_commit, repo.contributor_count ?? 0),
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

### Import Rules (ENFORCED -- from MODULE-BOUNDARIES.md Section 4)
| Module | CAN Import | CANNOT Import |
|--------|-----------|--------------|
| `scores/*` | Nothing (pure functions, zero project imports) | `schema/*`, `drizzle-orm`, `snapshots/*`, `projects/*`, `db`, `constants` |
| `schema/repo-trends.ts` | `schema/repos.ts` (FK only), `drizzle-orm`, `drizzle-orm/pg-core` | `scores/*`, `snapshots/*`, `projects/*`, `db`, `schema/project-trends.ts` |
| `schema/project-trends.ts` | `schema/projects.ts` (FK only), `drizzle-orm`, `drizzle-orm/pg-core` | `scores/*`, `snapshots/*`, `schema/repos.ts`, `db`, `schema/repo-trends.ts` |
| `refresh-cache.task.ts` | Everything: `@repo/db`, `@repo/db/scores`, `@repo/db/snapshots`, `@repo/db/projects`, `@repo/db/constants`, `@/task-runner` | No restrictions (top-level orchestrator) |

### Anti-Patterns to Avoid
- **Importing schema in scores/:** Violates the zero-dependency leaf constraint. Each score function defines its own local types via structural typing.
- **Shared type file for score inputs:** Creates coupling. TypeScript structural typing handles compatibility at call sites. If shapes diverge, the refresh task (which bridges both) gets a compile error.
- **Using `processRepos` iteration helper for refresh task:** Adds unnecessary complexity (concurrency, throttling, per-item callbacks with N+1 queries). The refresh task should query all eligible repos in bulk.
- **Reusing `getPackageData()`:** It picks `packages[0]` (first package), NOT highest downloads. Must use `resolvePrimaryPackage()` from `scores/primary-package.ts`.
- **Computing trends inside scores/:** `computeTrends()` lives in `snapshots/`. The refresh task calls it and passes results to score functions.
- **Importing from `scores/` in schema modules:** Schema depends on nothing except its FK targets.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Star trend deltas | Custom snapshot diff logic | `computeTrends(flattenSnapshots())` from `@repo/db/snapshots` + `@repo/db/projects` | Already handles edge cases: missing days, exact/approximate matching, daily delta interpolation from 2-day gaps |
| Snapshot flattening | Manual JSONB extraction | `flattenSnapshots()` from `packages/db/src/projects/project-helpers.ts` | Handles the nested `{year, months: [{month, snapshots: [{day, stars}]}]}` JSONB structure |
| Task infrastructure | Custom CLI / cron wrapper | `createTask()` + register in `cli.ts` | Gets logging, error handling, CLI flags for free |
| Migration files | Hand-written SQL | `pnpm --filter @repo/db generate` then `pnpm --filter @repo/db migrate` | Drizzle Kit reads schema diff and generates correct migration SQL |

**Key insight:** The entire trend computation pipeline (snapshot flattening + delta calculation) is already battle-tested. The scoring functions are the only genuinely new logic in this phase.

## Common Pitfalls

### Pitfall 1: Monorepo Deduplication Failure
**What goes wrong:** Multiple projects sharing a repo cause duplicate `repo_trends` computation or inconsistent scores.
**Why it happens:** Iterating projects instead of repos for Pass 1.
**How to avoid:** Pass 1 queries `SELECT DISTINCT r.id FROM repos r INNER JOIN projects p ON p."repoId" = r.id WHERE p.status IN (...)`. Build a `Map<repoId, { popularityScore, activityScore }>` for Pass 2 lookup.
**Warning signs:** `repo_trends` row count exceeds distinct repo count, or wasted `computeTrends()` calls.

### Pitfall 2: NULL vs 0 Confusion in Trend Deltas
**What goes wrong:** NULL and 0 treated identically, or NULL projects appear at top of descending sorts.
**Why it happens:** Not distinguishing "no data available" (NULL) from "computed zero change" (0).
**How to avoid:** Schema uses nullable `integer()` for trend columns (no `.notNull()`). Indexes use `.nullsLast()`. `computeTrends()` returns `undefined` for missing data -- map `undefined` to SQL `NULL`.
**Warning signs:** Projects with no snapshots sorting above projects with actual zero trends.

### Pitfall 3: Primary Package Resolution via Wrong Helper
**What goes wrong:** `getPackageData()` in `project-helpers.ts` picks `project.packages[0]` (first package), not highest downloads.
**Why it happens:** Reusing existing helper instead of implementing CONTEXT.md requirement.
**How to avoid:** Use `resolvePrimaryPackage()` from `scores/primary-package.ts` which selects by max `monthlyDownloads`. Do NOT reuse `getPackageData()`.
**Warning signs:** Projects with multiple packages showing wrong npm name in `project_trends`.

### Pitfall 4: Snapshot Sorting Assumption
**What goes wrong:** `computeTrends()` produces wrong deltas.
**Why it happens:** `computeTrends()` calls `snapshots.reverse()` internally (line 18), expecting ascending year order input. Wrong input order = inverted results.
**How to avoid:** Always order snapshots `asc(schema.snapshots.year)` when querying. The existing `findRepoById()` in `repo-processor.ts` does this correctly. Also note: `snapshots.reverse()` MUTATES the array -- pass a copy if you need the original order later.
**Warning signs:** Negative daily deltas for trending projects, or all deltas being `undefined`.

### Pitfall 5: Score Rounding for INTEGER Columns
**What goes wrong:** Storing float scores in INTEGER columns causes silent truncation.
**Why it happens:** Log-scale formulas produce floating point values; Drizzle/Postgres INTEGER truncates.
**How to avoid:** `Math.round()` all score values inside the scoring functions before returning. Every score function should return an integer.
**Warning signs:** Scores stored as 0 when they should be non-zero (truncation of 0.7 to 0).

### Pitfall 6: Task Return Type Contract
**What goes wrong:** TypeScript errors when task does not return expected shape.
**Why it happens:** `Task.run` must return `Promise<{ data: unknown; meta: MetaResult }>` where MetaResult values are `boolean | number | undefined`.
**How to avoid:** Return `{ data: null, meta: { repos: N, projects: N, errors: N } }`.
**Warning signs:** TypeScript compilation errors on the task export.

### Pitfall 7: Missing Task Registration in cli.ts
**What goes wrong:** New task created but not runnable from CLI.
**Why it happens:** `cli.ts` manually imports and registers each task in the `commands` array.
**How to avoid:** Import `refreshCacheTask` in `cli.ts` and add to the `commands` array.
**Warning signs:** CLI shows no `refresh-cache` command.

### Pitfall 8: `packages.monthlyDownloads` Column Name Mismatch
**What goes wrong:** Using SQL column name `downloads` instead of Drizzle property name `monthlyDownloads` in queries.
**Why it happens:** Schema defines `monthlyDownloads: integer("downloads")` -- TS name differs from SQL name.
**How to avoid:** Always use the Drizzle property name (`packages.monthlyDownloads`) in queries.
**Warning signs:** Column not found errors.

## Code Examples

### Verified: computeTrends() Input/Output
```typescript
// Source: packages/db/src/snapshots/compute-trends.ts
// Input: Snapshot[] = Array of {year, month, day, stars} -- sorted ascending by year
// Output: { daily: number|undefined, weekly: number|undefined, monthly: number|undefined,
//           quarterly: number|undefined, yearly: number|undefined }

import { computeTrends } from "@repo/db/snapshots";
import { flattenSnapshots } from "@repo/db/projects";

// snapshots from DB (OneYearSnapshots[]), ordered by year ASC
const flat = flattenSnapshots(snapshotRows);
const trends = computeTrends(flat); // {daily: 5, weekly: 30, monthly: 120, ...}
```

### Verified: createTask() Pattern and TaskContext
```typescript
// Source: apps/backend/src/task-runner.ts:18-39 + task-types.ts:35-42
// TaskContext provides: { db, logger, dryRun, processProjects, processRepos,
//                         processHallOfFameMembers, saveJSON, readJSON }
// Only db and logger needed for refresh task

export const refreshCacheTask = createTask({
  name: "refresh-cache",
  description: "...",
  run: async ({ db, logger }) => {
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
// Existing exclusion pattern: notInArray(schema.projects.status, ["deprecated", "hidden"])
// For this phase (inclusion): inArray(schema.projects.status, ["active", "featured", "promoted"])
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

### Verified: Migration Generation and Application
```bash
# From monorepo root:
pnpm --filter @repo/db generate  # Reads schema/, generates SQL in packages/db/drizzle/
pnpm --filter @repo/db migrate   # Applies pending migrations to POSTGRES_URL
# Requires: .env.development (or STAGE env var) with POSTGRES_URL
```

### Barrel Export Pattern for schema/index.ts
```typescript
// Source: packages/db/src/schema/index.ts -- add two new lines:
export * from "./repo-trends";
export * from "./project-trends";
```

### Barrel Export for scores/index.ts
```typescript
// packages/db/src/scores/index.ts
export { computePopularityScore } from "./popularity";
export { computeActivityScore } from "./activity";
export { computeUsageScore } from "./usage";
export { computeRelevanceScore } from "./relevance";
export { resolvePrimaryPackage } from "./primary-package";
```

### Querying Distinct Repos for Pass 1
```typescript
// Derived from repo-processor.ts pattern + CONTEXT.md status filter
const eligibleStatuses = ["active", "featured", "promoted"] as const;

const repos = await db
  .selectDistinctOn([schema.repos.id], {
    id: schema.repos.id,
    stars: schema.repos.stars,
    lastCommit: schema.repos.last_commit,
    contributorCount: schema.repos.contributor_count,
  })
  .from(schema.repos)
  .innerJoin(schema.projects, eq(schema.projects.repoId, schema.repos.id))
  .where(inArray(schema.projects.status, [...eligibleStatuses]));
```

### Fetching Snapshots per Repo
```typescript
// Derived from repo-processor.ts:76-80
const snapshotRows = await db
  .select({ year: schema.snapshots.year, months: schema.snapshots.months })
  .from(schema.snapshots)
  .where(eq(schema.snapshots.repoId, repoId))
  .orderBy(asc(schema.snapshots.year));

const flat = flattenSnapshots(snapshotRows);
const trends = computeTrends([...flat]); // spread to avoid mutation
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Static JSON (`projects.json`) with client-side mingo queries | Pre-computed cache tables with DB queries | This migration | Enables server-side sorting, filtering, pagination |
| `shouldIncludeProjectInMainList()` boolean filter | Multi-dimensional scoring (popularity, activity, usage, relevance) | This migration | Continuous quality signal vs binary include/exclude |
| `getPackageData()` picks first package | `resolvePrimaryPackage()` picks highest monthly downloads | This migration | Correct primary package selection for multi-package projects |
| Per-project trend computation in static API build | Per-repo deduplicated computation + caching | This migration | Correct monorepo handling, avoids redundant computation |

**Existing code preserved:**
- `buildStaticApiTask` continues running unchanged (DATA-02 in Phase 2)
- `computeTrends()` and `flattenSnapshots()` reused as-is (no modifications)

## Open Questions

1. **Batch vs individual upserts (Claude's discretion)**
   - What we know: ~3,500 projects, ~3,000 distinct repos. Individual upserts work at this scale.
   - What's unclear: Whether batch upserts with `sql.raw('excluded.column')` provide meaningful speedup
   - Recommendation: Start with individual upserts in a loop (simpler, reliable). The batch pattern is available as optimization if needed.

2. **Score rounding strategy**
   - What we know: Formulas produce floats; schema uses INTEGER columns
   - What's unclear: Whether to use `Math.round()`, `Math.floor()`, or `Math.trunc()`
   - Recommendation: Use `Math.round()` consistently. The formulas are tunable anyway.

3. **Error handling granularity (Claude's discretion)**
   - What we know: Existing tasks use per-item try/catch in iteration helpers
   - Recommendation: Wrap each repo/project upsert in try/catch, log errors, continue processing. Return error count in meta. Do not retry -- a failed item will be retried on next daily run.

4. **Cleanup step for deprecated repos**
   - What we know: Deprecated repos should not have `repo_trends` rows
   - Recommendation: Run cleanup as first step: `DELETE FROM repo_trends WHERE repo_id NOT IN (SELECT DISTINCT "repoId" FROM projects WHERE status IN ('active', 'featured', 'promoted'))`. Similarly for `project_trends`.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | bun:test (built-in) |
| Config file | none -- bun:test works without config |
| Quick run command | `cd packages/db && bun test src/scores/` |
| Full suite command | `cd packages/db && bun test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SCORE-01 | popularity_score signed log scale | unit | `cd packages/db && bun test src/scores/popularity.test.ts` | Wave 0 |
| SCORE-02 | activity_score log2 decay + bonus | unit | `cd packages/db && bun test src/scores/activity.test.ts` | Wave 0 |
| SCORE-03 | usage_score log10 of downloads | unit | `cd packages/db && bun test src/scores/usage.test.ts` | Wave 0 |
| SCORE-04 | relevance_score weighted blend | unit | `cd packages/db && bun test src/scores/relevance.test.ts` | Wave 0 |
| CACHE-05 | resolvePrimaryPackage highest downloads | unit | `cd packages/db && bun test src/scores/primary-package.test.ts` | Wave 0 |
| CACHE-01 | repo_trends schema valid | smoke | `pnpm --filter @repo/db typecheck` | N/A (type check) |
| CACHE-02 | project_trends schema valid | smoke | `pnpm --filter @repo/db typecheck` | N/A (type check) |
| CACHE-03 | Refresh task populates tables | integration | Manual -- requires database | manual-only |
| CACHE-04 | Monorepo dedup (one row per repo) | integration | Manual -- requires database | manual-only |
| DATA-01 | Status filter excludes deprecated | integration | Manual -- requires database | manual-only |
| DATA-03 | repo_trends keyed by repo_id | unit (schema) | Type check -- PK is repoId | N/A |

### Sampling Rate
- **Per task commit:** `cd packages/db && bun test src/scores/`
- **Per wave merge:** `cd packages/db && bun test && pnpm --filter @repo/db typecheck`
- **Phase gate:** Full suite green + manual refresh task execution against dev database

### Wave 0 Gaps
- [ ] `packages/db/src/scores/popularity.test.ts` -- covers SCORE-01
- [ ] `packages/db/src/scores/activity.test.ts` -- covers SCORE-02
- [ ] `packages/db/src/scores/usage.test.ts` -- covers SCORE-03
- [ ] `packages/db/src/scores/relevance.test.ts` -- covers SCORE-04
- [ ] `packages/db/src/scores/primary-package.test.ts` -- covers CACHE-05

No framework install needed -- `bun:test` is built-in and already used in the project.

## Sources

### Primary (HIGH confidence)
- Codebase files (all verified via direct read):
  - `packages/db/src/schema/repos.ts` -- schema pattern, column types, FK references, uniqueIndex
  - `packages/db/src/schema/projects.ts` -- FK pattern, status enum, ON DELETE CASCADE
  - `packages/db/src/schema/packages.ts` -- `monthlyDownloads: integer("downloads")`, project FK
  - `packages/db/src/schema/daily-featured-projects.ts` -- simple table schema pattern
  - `packages/db/src/schema/index.ts` -- barrel export pattern (8 existing re-exports)
  - `packages/db/src/snapshots/compute-trends.ts` -- `computeTrends()` signature, returns `undefined` for missing, calls `reverse()` mutating input
  - `packages/db/src/snapshots/types.ts` -- `Snapshot = { year, month, day, stars }`
  - `packages/db/src/projects/project-helpers.ts` -- `flattenSnapshots()`, `getPackageData()` picks `[0]` not max
  - `packages/db/src/projects/get.ts` -- `ProjectDetails` type, `OneYearSnapshots`, `snapshotsSchema`
  - `packages/db/src/constants.ts` -- `PROJECT_STATUSES = ['active', 'featured', 'promoted', 'deprecated', 'hidden']`
  - `packages/db/package.json` -- current exports map, dependencies
  - `packages/db/drizzle.config.ts` -- schema path `./src/schema/index.ts`, dialect `postgresql`
  - `packages/db/src/index.ts` -- `db`, `schema` exports, `DB` type, `runQuery()`
  - `packages/db/src/drizzle.ts` -- re-exports all of `drizzle-orm`
  - `apps/backend/src/task-runner.ts` -- `createTask()` factory, `TaskContext` creation
  - `apps/backend/src/task-types.ts` -- `Task<FlagsType>`, `TaskContext` interface
  - `apps/backend/src/cli.ts` -- task registration: import + add to commands array
  - `apps/backend/src/tasks/build-static-api.task.ts` -- upsert pattern, status filtering, trend computation flow
  - `apps/backend/src/iteration-helpers/repo-processor.ts` -- distinct repo query with GROUP BY
  - `packages/db/src/snapshots/snapshots.test.ts` -- `bun:test` usage pattern (describe/test/expect)
- MODULE-BOUNDARIES.md -- architectural constraints (user-authored PRD, verified)
- CONTEXT.md -- locked decisions (user-authored, verified)

### Secondary (MEDIUM confidence)
- Drizzle ORM index API supports `.desc()` and `.nullsLast()` per-column since v0.31.0 (project uses v0.44.5)
- Drizzle ORM batch upsert with `sql.raw('excluded.column_name')` pattern documented in official upsert guide

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- entirely existing codebase dependencies, no new packages
- Architecture: HIGH -- MODULE-BOUNDARIES.md specifies exact module catalog, exports, import rules, and dependency graph
- Scoring formulas: HIGH -- fully specified in CONTEXT.md with exact mathematical expressions
- Pitfalls: HIGH -- identified from direct codebase analysis (snapshot mutation, package selection, monorepo dedup, column naming)
- Index syntax: HIGH -- Drizzle `.desc().nullsLast()` available since v0.31.0, project uses v0.44.5

**Research date:** 2026-04-09
**Valid until:** 2026-05-09 (stable domain -- Drizzle ORM 0.44.x, no breaking changes expected)
