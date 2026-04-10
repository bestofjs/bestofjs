# Overview — Phase 1 Cache Foundation

## 1. What Phase 1 delivers

A **denormalized, daily-refreshed cache** (`repo_trends`, `project_trends`) plus a **pure scoring module** (`packages/db/src/scores/`), populated by a new backend task (`refresh-cache.task.ts`). Nothing reads these tables yet — the read-path migration is Phase 2+.

The single architectural property that matters: **`packages/db/src/scores/` has zero project imports.** It is a leaf module of pure functions. Everything else in the design follows from that.

---

## 2. Bounded contexts

Phase 1 formalises two bounded contexts that share one PostgreSQL database (Shared Kernel). The contexts already exist implicitly; Phase 1 names them and draws the boundary.

| Context | Owns | Status |
|---|---|---|
| **Project Catalog** | `repos`, `projects`, `packages`, `snapshots`, `tags` | Already exists — no schema changes in Phase 1 |
| **Trend Analytics** | `repo_trends`, `project_trends`, `scores/` module, refresh task | **New in Phase 1** |

**Relationship:** Trend Analytics is a **downstream consumer** of Project Catalog. It reads `repos`/`projects`/`packages`/`snapshots` but never writes to them. Cache tables are **derived, denormalized data** (Evans's term) owned exclusively by Trend Analytics — they are **not aggregate members** of Repo or Project.

See [CONCEPTS.md §3.1](./CONCEPTS.md#31-cache-tables-are-denormalised-derived-data-not-projections) for why "projection" is avoided as a term.

---

## 3. Modules — current vs after

### 3.1 `packages/db/src/` (domain layer)

| Module | Current | After Phase 1 | Owner |
|---|---|---|---|
| `schema/repos.ts` | ✔ | ✔ unchanged | Project Catalog |
| `schema/projects.ts` | ✔ | ✔ unchanged | Project Catalog |
| `schema/packages.ts` | ✔ | ✔ unchanged | Project Catalog |
| `schema/snapshots.ts` | ✔ | ✔ unchanged | Project Catalog |
| `schema/tags.ts` | ✔ | ✔ unchanged | Project Catalog |
| **`schema/repo-trends.ts`** | — | **NEW** (Plan 01-01) | Trend Analytics |
| **`schema/project-trends.ts`** | — | **NEW** (Plan 01-01) | Trend Analytics |
| `snapshots/compute-trends.ts` | ✔ (produces `{daily..yearly}`) | ✔ reused | Project Catalog |
| `projects/find.ts` | ✔ (mingo-equivalent Drizzle queries) | ✔ unchanged — *but see false-cognate note below* | Project Catalog |
| `projects/project-helpers.ts` | ✔ — contains `flattenSnapshots` and the known-bad `getPackageData` | ✔ `flattenSnapshots` reused; `getPackageData` stays (to be deprecated in Phase 2) | Project Catalog |
| **`scores/popularity.ts`** | — | **NEW** (Plan 01-02) | Trend Analytics |
| **`scores/activity.ts`** | — | **NEW** (Plan 01-02) | Trend Analytics |
| **`scores/usage.ts`** | — | **NEW** (Plan 01-02) | Trend Analytics |
| **`scores/relevance.ts`** | — | **NEW** (Plan 01-02) ⚠ see false-cognate | Trend Analytics |
| **`scores/primary-package.ts`** | — | **NEW** (Plan 01-02) | Trend Analytics |
| **`scores/index.ts`** | — | **NEW** barrel (Plan 01-02) | Trend Analytics |

### 3.2 `apps/backend/src/` (application layer)

| Module | Current | After Phase 1 |
|---|---|---|
| `tasks/build-static-api.task.ts` | Orchestrates daily JSON build; contains `shouldIncludeProjectInMainList`, `isColdProject`, `isPopularPackage`, `isInactiveProject`, `isPromotedProject`, `isFeaturedProject` — the **implicit** eligibility predicates | Unchanged in Phase 1. Will be superseded in Phase 5 cutover. |
| **`tasks/refresh-cache.task.ts`** | — | **NEW** (Plan 01-03). Two-pass application service: Pass 1 repos → `repo_trends`, Pass 2 projects → `project_trends` |
| `cli.ts` | Registers existing tasks | **MODIFIED** (Plan 01-03) — registers `refresh-cache.task.ts` |

### 3.3 `packages/db/package.json` exports

| Entry | Current | After Phase 1 |
|---|---|---|
| `"."`, `"./schema"`, `"./projects"`, `"./snapshots"`, `"./tags"`, `"./constants"`, `"./drizzle"`, `"./shared-schemas"`, `"./types"`, `"./hall-of-fame"` | ✔ | ✔ unchanged |
| **`"./scores"`** | — | **NEW** (Plan 01-04) — exposes scoring barrel without pulling in Drizzle |

---

## 4. Key concepts — mapped to the plan

Concepts flow through the four execution plans like this:

```
Plan 01-01  ──►  Schemas: repo_trends, project_trends
                 Concepts: AGGREGATE BOUNDARY (cache ∉ aggregate),
                           DERIVED DATA, trend-delta NULL vs 0

Plan 01-02  ──►  scores/ module (TDD, pure functions)
                 Concepts: COHESIVE MECHANISM (not Domain Service — see CONCEPTS.md §3.3),
                           VALUE OBJECTS (TrendDeltas, ScoreSet, PrimaryPackageInfo),
                           POLICIES (RelevanceWeight, PrimaryPackageSelection)

Plan 01-03  ──►  refresh-cache.task.ts (orchestrator)
                 Concepts: APPLICATION SERVICE,
                           SPECIFICATIONS (EligibleProject, EligibleRepo),
                           MONOREPO DEDUPLICATION (Pass 1 keys by repo_id),
                           PRIMARY PACKAGE (argmax(monthlyDownloads))

Plan 01-04  ──►  package.json ./scores export
                 Concepts: LEAF MODULE, no transitive Drizzle dependency
```

### Concept → Plan → Code file

| Concept | Plan | Files |
|---|---|---|
| `repo_trends` table + FK cascade | 01-01 | `schema/repo-trends.ts`, `schema/index.ts` |
| `project_trends` table + FK cascade | 01-01 | `schema/project-trends.ts`, `schema/index.ts` |
| `TrendDeltas` value object (verbatim from `computeTrends`) | 01-02 | `scores/popularity.ts` (local type) |
| `computePopularityScore` | 01-02 | `scores/popularity.ts` |
| `computeActivityScore` | 01-02 | `scores/activity.ts` |
| `computeUsageScore` | 01-02 | `scores/usage.ts` |
| `computeRelevanceScore` ⚠ | 01-02 | `scores/relevance.ts` |
| `PrimaryPackageSelectionPolicy` (`resolvePrimaryPackage`) | 01-02 | `scores/primary-package.ts` |
| `EligibleProjectSpecification` (implicit → explicit) | 01-03 | `refresh-cache.task.ts` (Drizzle `inArray` on `PROJECT_STATUSES`) |
| `EligibleRepoSpecification` (monorepo dedup) | 01-03 | `refresh-cache.task.ts` (Pass 1 distinct `repo_id`) |
| `RefreshProcess` (two-pass order, implicit) | 01-03 | `refresh-cache.task.ts` sequential code |
| Leaf-module guarantee | 01-04 | `packages/db/package.json` |

⚠ **`relevanceScore` is a false cognate — documented, deferred to Phase 2.** `packages/db/src/projects/find.ts:168` already uses this identifier for a text-search CASE expression. The Trend Analytics meaning ("composite quality floor") is different. Phase 1 does not touch `find.ts`, so the rename is *not* in this PR — pre-applying it would be scope creep. The collision is recorded in DDD-DESIGN.md §2 and the Phase 2 plan will resolve it atomically with the listing-query migration that actually reads the `relevance_score` column. See [CONCEPTS.md §3.2](./CONCEPTS.md#32-relevancescore-is-a-false-cognate).

---

## 5. What this PR does **not** change

- No changes to `apps/web/` — the web app still reads from static JSON.
- No changes to `build-static-api.task.ts` — still runs, still builds JSON.
- No new queries on the cache tables (that is Phase 2).
- No removal of the `mingo` dependency (that is Phase 5 cutover).
- **No changes to `packages/db/src/projects/find.ts`.** Phase 1 is purely additive in `packages/db`. The `relevanceScore` false-cognate rename is deferred to Phase 2.

The invariant: **after this PR, the system behaves identically to before. Only the database has two new populated tables.**

---

## 6. Dependency rule (enforced by module boundaries)

```
refresh-cache.task.ts  (application layer, apps/backend)
        │
        ├──►  @repo/db           (schema, db object)
        ├──►  @repo/db/scores    (pure functions — leaf)
        ├──►  @repo/db/snapshots (computeTrends)
        ├──►  @repo/db/projects  (flattenSnapshots)
        └──►  @repo/db/constants (PROJECT_STATUSES)

schema/repo-trends.ts     ──►  schema/repos.ts     (FK only)
schema/project-trends.ts  ──►  schema/projects.ts  (FK only)

scores/*  ──►  (nothing from the project)
```

Violations to reject in review:
- `scores/*.ts` importing from `schema/*`, `drizzle-orm`, or any other project module.
- `schema/repo-trends.ts` importing from `scores/*`.
- `schema/repo-trends.ts` ↔ `schema/project-trends.ts` cross-imports.
- The refresh task re-implementing a score formula instead of calling `@repo/db/scores`.
