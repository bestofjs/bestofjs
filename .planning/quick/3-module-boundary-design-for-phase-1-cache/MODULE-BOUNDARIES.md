# Module Boundary Design: Phase 1 Cache Foundation

This document defines the exact boundaries, exports, dependencies, and import rules for all new modules introduced by Phase 1 (Cache Foundation). It serves as the authoritative reference for plan executors, ensuring clean separation between the Project Catalog and Trend Analytics bounded contexts.

---

## Section 1: Module Catalog

### 1.1 `packages/db/src/schema/repo-trends.ts` -- Repo-Level Cache Table Schema

**Responsibility:** Defines the Drizzle ORM table schema for the `repo_trends` cache table, which stores denormalized star counts, trend deltas, and repo-level scores.

**Exports:**
- `repoTrends` (pgTable) -- the table definition
- `repoTrendsRelations` (relations) -- Drizzle relational mapping to `repos`

**What goes IN this module:**
- Table column definitions (PK, star count, trend deltas, score columns, refreshedAt)
- Column types, nullability, and defaults (e.g., `integer("popularity_score").notNull().default(0)`)
- Index definitions (descending indexes on sort columns with NULLS LAST)
- Foreign key reference to `repos.id` with ON DELETE CASCADE
- Drizzle `relations()` declaration linking `repoTrends` back to `repos`

**What stays OUT:**
- Query functions (no `findByRepoId`, `upsertRepoTrend` -- those live in the refresh task)
- Score computation logic (lives in `scores/`)
- Trend computation logic (lives in `snapshots/compute-trends.ts`)
- Validation logic or business rules
- Any runtime imports beyond drizzle-orm and the `repos` schema reference

---

### 1.2 `packages/db/src/schema/project-trends.ts` -- Project-Level Cache Table Schema

**Responsibility:** Defines the Drizzle ORM table schema for the `project_trends` cache table, which stores primary package info, download counts, and project-level scores.

**Exports:**
- `projectTrends` (pgTable) -- the table definition
- `projectTrendsRelations` (relations) -- Drizzle relational mapping to `projects`

**What goes IN this module:**
- Table column definitions (PK, package_name, monthly_downloads, score columns, refreshedAt)
- Column types, nullability, and defaults
- Index definitions (descending indexes on score and download columns)
- Foreign key reference to `projects.id` with ON DELETE CASCADE
- Drizzle `relations()` declaration linking `projectTrends` back to `projects`

**What stays OUT:**
- Query functions (upserts live in the refresh task, reads will live in Phase 2 `listings/`)
- Score computation logic (lives in `scores/`)
- Primary package resolution logic (lives in `scores/primary-package.ts`)
- Validation logic or business rules
- Any runtime imports beyond drizzle-orm and the `projects` schema reference

---

### 1.3 `packages/db/src/scores/` -- Scoring Cohesive Mechanism

**Responsibility:** Houses all pure scoring functions and primary package resolution. These form a **Cohesive Mechanism** (Evans's term) for the Trend Analytics context -- algorithmic machinery that computes quality signals from primitive inputs, factored out so the core domain can focus on *what* rather than *how*. They are **not** Domain Services by Evans's own criterion: Domain Service parameters and results "should be domain objects," whereas these functions operate on primitives (`number`, `Date | null`) and a locally-defined structural shape. See `DDD-DESIGN.md §5` for the full rationale. The zero-dependency leaf-node property defined below is the structural consequence of this pattern -- a Cohesive Mechanism is meant to be isolated from domain objects.

**Barrel export:** `packages/db/src/scores/index.ts`

**Exports from barrel:**
- `computePopularityScore` -- signed log-scale metric from star trend deltas
- `computeActivityScore` -- 0-100 metric from last commit recency and contributor count
- `computeUsageScore` -- 0-100 metric from monthly npm downloads
- `computeRelevanceScore` -- weighted composite of the three dimension scores
- `resolvePrimaryPackage` -- selects the package with highest monthly downloads

**Internal files:**
- `popularity.ts` -- `computePopularityScore(trends: TrendDeltas): number`
- `activity.ts` -- `computeActivityScore(lastCommit: Date | null, contributorCount: number, referenceDate?: Date): number`
- `usage.ts` -- `computeUsageScore(monthlyDownloads: number | null): number`
- `relevance.ts` -- `computeRelevanceScore(popularityScore: number, activityScore: number, usageScore: number, hasPackage: boolean): number`
- `primary-package.ts` -- `resolvePrimaryPackage(packages: PackageInfo[]): PackageInfo | null`
- `index.ts` -- barrel re-export

**What goes IN this module:**
- Pure scoring functions (no side effects, no I/O)
- Locally-defined input types (structural typing, not shared types)
- Primary package resolution logic (max-by-downloads selection)
- Score formula constants (weights, decay rates, scale factors)

**What stays OUT:**
- Database access of any kind (no drizzle-orm imports, no `db` object)
- Schema imports (no `import { repoTrends } from "../schema/..."`)
- Task orchestration or sequencing logic (lives in `refresh-cache.task.ts`)
- Trend computation from snapshots (lives in `snapshots/compute-trends.ts`)
- Shared type definitions from schema (each function defines its own minimal input type)

---

### 1.4 `apps/backend/src/tasks/refresh-cache.task.ts` -- Daily Refresh Application Service

**Responsibility:** Orchestrates the daily cache population using a two-pass approach: Pass 1 computes repo-level metrics (deduplicated by repo_id), Pass 2 computes project-level metrics. This is an Application Service -- it coordinates the scoring Cohesive Mechanism (`@repo/db/scores`) and Repository operations but contains no domain logic itself.

**Exports:**
- `refreshCacheTask` (Task) -- created via `createTask()` from `@/task-runner`

**What goes IN this module:**
- Two-pass orchestration logic (Pass 1: repos, Pass 2: projects)
- Status filtering (active/featured/promoted eligibility check)
- Drizzle upsert calls (`db.insert().onConflictDoUpdate()`)
- Error handling per item (try/catch with logging, continue on failure)
- Logging and meta statistics (repo/project counts, error counts)
- In-memory score lookup map (Map<repoId, scores> built in Pass 1, consumed in Pass 2)

**What stays OUT:**
- Score formulas (imported from `@repo/db/scores`, not reimplemented)
- Trend computation (reuses `computeTrends` from `@repo/db/snapshots`)
- Snapshot flattening (reuses `flattenSnapshots` from `@repo/db/projects`)
- Schema definitions (imported from `@repo/db/schema`, not defined here)
- Table structure decisions (schema modules own column definitions)

---

## Section 2: Dependency Graph

```
                    APPLICATION LAYER (apps/backend)
  ┌─────────────────────────────────────────────────────────┐
  │                                                         │
  │   refresh-cache.task.ts                                 │
  │       │         │         │          │          │        │
  │       │         │         │          │          │        │
  └───────┼─────────┼─────────┼──────────┼──────────┼────────┘
          │         │         │          │          │
          v         v         v          v          v
   ┌──────────┐ ┌────────┐ ┌────────┐ ┌─────────┐ ┌──────────────┐
   │ scores/  │ │ repo-  │ │project-│ │snapshots│ │  projects/   │
   │ index.ts │ │trends  │ │trends  │ │compute- │ │project-      │
   │          │ │  .ts   │ │  .ts   │ │trends.ts│ │helpers.ts    │
   └──────────┘ └───┬────┘ └───┬────┘ └─────────┘ └──────────────┘
     (LEAF -        │          │
      NO DEPS)      v          v
               ┌─────────┐ ┌──────────┐
               │ repos.ts│ │projects  │
               │ (schema)│ │.ts       │
               └─────────┘ │(schema)  │
                           └──────────┘

                    DOMAIN LAYER (packages/db/src)
```

**Detailed dependency arrows (A --> B means "A depends on B"):**

```
refresh-cache.task.ts  -->  scores/index.ts           (imports scoring functions)
refresh-cache.task.ts  -->  schema/repo-trends.ts     (upserts into repoTrends)
refresh-cache.task.ts  -->  schema/project-trends.ts  (upserts into projectTrends)
refresh-cache.task.ts  -->  snapshots/compute-trends.ts  (reuses trend computation)
refresh-cache.task.ts  -->  projects/project-helpers.ts  (reuses flattenSnapshots)

schema/repo-trends.ts     -->  schema/repos.ts       (FK reference only)
schema/project-trends.ts  -->  schema/projects.ts    (FK reference only)

scores/*  -->  (NOTHING)    <-- KEY ARCHITECTURAL PROPERTY
```

**Key architectural property:** `scores/` is a **leaf node** with zero inbound code dependencies. It imports nothing from the project codebase -- no schema, no database, no ORM, no other modules. It defines its own minimal input types via structural typing. This makes all five scoring functions trivially testable with `bun:test` without any database fixtures, mocks, or setup.

The `relevance.ts` function depends *conceptually* on the outputs of the other three score functions (it takes `popularityScore`, `activityScore`, and `usageScore` as parameters), but it does NOT import them. The dependency is a data dependency at call sites (the refresh task passes values), not a code dependency.

---

## Section 3: Package.json Exports

### New export entry needed in `packages/db/package.json`:

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./drizzle": "./src/drizzle.ts",
    "./schema": "./src/schema.ts",
    "./constants": "./src/constants.ts",
    "./projects": "./src/projects/index.ts",
    "./shared-schemas": "./src/shared-schemas.ts",
    "./snapshots": "./src/snapshots/index.ts",
    "./tags": "./src/tags/index.ts",
    "./hall-of-fame": "./src/hall-of-fame.ts",
    "./types": "./src/types.ts",
    "./scores": "./src/scores/index.ts"
  }
}
```

**Only one new entry:** `"./scores": "./src/scores/index.ts"`

This enables the backend app to import via:
```typescript
import { computePopularityScore, computeActivityScore, ... } from "@repo/db/scores";
```

### Schema tables -- NO new export entry needed

The two new schema files (`repo-trends.ts`, `project-trends.ts`) are re-exported from the existing barrel at `packages/db/src/schema/index.ts`. The existing `"./schema": "./src/schema.ts"` export already covers them. Consumers access cache table definitions via:

```typescript
import { repoTrends, projectTrends } from "@repo/db/schema";
```

Note: The main entry point (`"."`) exports `* as schema from "./schema"`, so `@repo/db` also provides `schema.repoTrends` and `schema.projectTrends` via the default import path used by the backend.

### Existing exports consumed by backend app

The backend app (`apps/backend`) currently imports from these `@repo/db` paths:
- `@repo/db` -- main entry: `db`, `schema` namespace, `DB` type
- `@repo/db/snapshots` -- `computeTrends`, snapshot utilities
- `@repo/db/projects` -- `flattenSnapshots`, project helpers
- `@repo/db/constants` -- `PROJECT_STATUSES` and similar constants

The new `@repo/db/scores` export follows the same pattern and is sufficient for Phase 1.

---

## Section 4: Import Rules (Layering Discipline)

| Module | CAN Import | CANNOT Import |
|--------|-----------|--------------|
| `scores/*` | Nothing (pure functions, zero project imports) | `schema/*`, `drizzle-orm`, `snapshots/*`, `projects/*`, `db`, `constants` |
| `schema/repo-trends.ts` | `schema/repos.ts` (FK reference only), `drizzle-orm`, `drizzle-orm/pg-core` | `scores/*`, `snapshots/*`, `projects/*`, `db`, `schema/project-trends.ts` |
| `schema/project-trends.ts` | `schema/projects.ts` (FK reference only), `drizzle-orm`, `drizzle-orm/pg-core` | `scores/*`, `snapshots/*`, `schema/repos.ts`, `db`, `schema/repo-trends.ts` |
| `refresh-cache.task.ts` | `@repo/db` (schema + db), `@repo/db/scores`, `@repo/db/snapshots`, `@repo/db/projects`, `@repo/db/constants`, `@/task-runner`, iteration helpers | No restrictions -- it is the top-level orchestrator |

### Rationale

The `scores/` module being import-free is the single most important boundary in the Phase 1 design. Here is why:

1. **Testability.** Pure functions with zero dependencies can be tested with `bun:test` in milliseconds. No database setup, no fixtures, no mocks. The test file imports the function, calls it with values, and asserts the result.

2. **Stability.** Score functions cannot break due to schema changes, ORM upgrades, or database connection issues. They depend only on their own input types and `Math.*` functions.

3. **Reusability.** Any module in the codebase can import from `@repo/db/scores` without pulling in transitive database dependencies. This matters for Phase 2 (listing queries might reference score column names) and Phase 3 (web layer might need score thresholds for UI labels).

4. **Dependency direction.** The arrows point the right way: the orchestrator (refresh task) depends on both schema and scores. Schema depends on nothing except its own FK targets. Scores depend on nothing. This is a clean layered architecture where dependencies flow from application layer down to domain layer, never upward.

---

## Section 5: Cross-Cutting Concerns

### Type Definitions

Each scoring function defines its own minimal input type locally via structural typing. This is a deliberate design choice, not an oversight.

| Type | Defined In | Used By | Sharing Strategy |
|------|-----------|---------|-----------------|
| `TrendDeltas` | `scores/popularity.ts` (local) | `computePopularityScore` | NOT shared. Each consumer defines its own compatible interface. The refresh task passes an object matching the shape -- TypeScript structural typing handles compatibility. |
| `PackageInfo` | `scores/primary-package.ts` (local) | `resolvePrimaryPackage` | NOT shared. Defines `{ name: string; monthlyDownloads: number \| null }`. The refresh task constructs objects matching this shape from query results. |
| `Snapshot` | `snapshots/types.ts` (existing) | `computeTrends`, `flattenSnapshots` | Already shared within the snapshots module. The refresh task passes snapshot data through without needing to know the type. |

**Why structural typing over shared types:**

Shared type imports create coupling. If `scores/popularity.ts` imported `TrendDeltas` from `schema/repo-trends.ts`, it would gain a transitive dependency on `drizzle-orm/pg-core` (since schema files import from there). The structural typing approach keeps the dependency arrow pointing the right way: schema depends on nothing, scores depend on nothing, the orchestrator depends on both.

TypeScript's structural type system ensures compatibility at compile time without explicit imports. If the shapes diverge (e.g., a column is renamed in the schema but not in the score function's local type), the refresh task -- which bridges both -- will produce a type error at the call site.

### Constants

| Constant | Location | Used By |
|----------|----------|---------|
| `PROJECT_STATUSES` | `packages/db/src/constants.ts` (existing) | Refresh task's status filter (`inArray(projects.status, ...)`) |
| Score formula weights | Inline in each `scores/*.ts` file | Only the scoring function that defines them |
| Relevance weight ratios (0.5/0.25/0.25 vs 0.65/0.35) | `scores/relevance.ts` | `computeRelevanceScore` only |

Score formula constants are NOT extracted into a shared config file. They are implementation details of each scoring function. If weight tuning becomes necessary, the constants can be extracted then -- premature extraction would scatter related logic across files.

### Score Column Types

Score columns in both cache tables use `integer NOT NULL DEFAULT 0`. Trend delta columns use nullable `integer` (no `.notNull()`). This is a locked decision from CONTEXT.md:
- `NOT NULL DEFAULT 0` for scores: avoids NULL handling in ORDER BY and WHERE clauses
- Nullable for trend deltas: `NULL` means "insufficient data to compute" (distinct from `0` meaning "computed zero change")

---

## Section 6: Future-Proofing Notes

### Phase 2: Listing Query Module

Phase 2 will create a new `packages/db/src/listings/` module (or similar) that provides database-backed listing queries replacing the current mingo-on-static-JSON approach.

**Boundary interaction:**
- `listings/` will READ from `repo_trends` and `project_trends` via JOINs (imports schema, not scores)
- `listings/` will NOT import from `scores/` for computation -- cache tables ARE the read model
- The `./scores` export path lets listing queries reference score column names for `ORDER BY` clauses if needed (e.g., `orderBy(desc(repoTrends.popularityScore))`)
- A new `"./listings": "./src/listings/index.ts"` export entry will be added to `package.json`

**No boundary changes needed** in Phase 1 modules. The cache tables' schema is the contract.

### Phase 3: Web Integration

Phase 3 integrates the listing queries into the Next.js web app.

**Boundary interaction:**
- The web app imports from `@repo/db/listings` (Phase 2 output) -- NOT directly from `scores/` or cache table schemas
- If the web layer needs score thresholds for UI labels (e.g., "trending" badge when popularity > X), it can import from `@repo/db/scores` without pulling in database dependencies (since scores/ is a leaf with zero deps)
- No changes to Phase 1 module boundaries

### Phase 4: Validation (Dual-Run)

Phase 4 runs the static API builder and the new DB-backed queries in parallel to compare results.

**Boundary interaction:**
- Dual-run comparison imports from both `@repo/db/listings` and the static API builder
- No changes to Phase 1 module boundaries
- Score functions and cache tables are consumed as-is

### Boundaries That Might Need Revisiting

1. **If listing queries need score recalculation** (unlikely -- cache tables are the read model): The `scores/` module would gain a new consumer but its interface would not change. No boundary violation.

2. **If real-time scoring is needed** (e.g., live popularity updates): The refresh task's batch approach would need supplementing with an event-driven path. The `scores/` module remains unchanged -- only the orchestration layer changes.

3. **If scoring functions need database access** (e.g., percentile-based scoring): This would violate the "scores/ is pure" boundary. The solution would be to compute the percentile data in the refresh task and pass it as an input parameter, preserving function purity.

4. **If a new score dimension is added** (e.g., `communityScore`): Add a new file in `scores/`, export from the barrel, add a column to the appropriate cache table schema, and update the refresh task. All existing boundaries hold.

---

*Document created: 2026-04-09*
*Source: DDD-DESIGN.md (quick task 2), Phase 1 plans (01-01 through 01-03)*
*Covers: 4 new modules (2 schema files, scores/ directory, refresh task)*
