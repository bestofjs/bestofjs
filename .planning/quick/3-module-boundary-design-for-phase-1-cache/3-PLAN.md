---
phase: quick
plan: 3
type: execute
wave: 1
depends_on: []
files_modified:
  - .planning/quick/3-module-boundary-design-for-phase-1-cache/MODULE-BOUNDARIES.md
autonomous: true
requirements: [CACHE-01, CACHE-02, SCORE-01]

must_haves:
  truths:
    - "Every new module introduced by phase 1 has a documented responsibility, export surface, and boundary definition"
    - "Dependency direction between all modules (new and existing) is captured in an ASCII diagram"
    - "Package.json exports entries for new modules are specified"
    - "Import rules state what each module CAN and CANNOT import"
    - "Future-proofing notes explain how boundaries accommodate Phase 2-4 additions"
  artifacts:
    - path: ".planning/quick/3-module-boundary-design-for-phase-1-cache/MODULE-BOUNDARIES.md"
      provides: "Module boundary design document for phase 1 cache foundation"
      min_lines: 120
  key_links: []
---

<objective>
Create a module boundary design document defining the exact boundaries, exports, dependencies, and import rules for all new modules introduced by phase 1 cache foundation.

Purpose: Codify the module structure decisions before implementation so that plan executors have clear, unambiguous guidance on what goes where and who depends on whom. Prevents accidental coupling and ensures the Trend Analytics bounded context stays cleanly separated from Project Catalog.
Output: MODULE-BOUNDARIES.md design document.
</objective>

<execution_context>
@/home/ubuwarudo/.claude/get-shit-done/workflows/execute-plan.md
@/home/ubuwarudo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/quick/2-ddd-designs-for-phase-1-cache-foundation/DDD-DESIGN.md
@.planning/phases/01-cache-foundation/01-01-PLAN.md
@.planning/phases/01-cache-foundation/01-02-PLAN.md
@.planning/phases/01-cache-foundation/01-03-PLAN.md
@packages/db/package.json
@packages/db/src/schema/index.ts
@packages/db/src/index.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Write module boundary design document</name>
  <files>.planning/quick/3-module-boundary-design-for-phase-1-cache/MODULE-BOUNDARIES.md</files>
  <action>
Create MODULE-BOUNDARIES.md covering the following sections. Use the DDD-DESIGN.md (quick task 2) and phase 1 plans as primary sources.

**Section 1: Module Catalog**

For each new module, document in a consistent format:
- Module name and path
- Responsibility (one sentence)
- Exports (exact named exports)
- What goes IN this module (inclusion criteria)
- What stays OUT (exclusion criteria, things that might be tempting to put here but should not)

New modules to catalog:

1. `packages/db/src/schema/repo-trends.ts` -- repo-level cache table schema
   - Exports: `repoTrends` (pgTable), `repoTrendsRelations` (relations)
   - IN: Table definition, column types, indexes, FK relations
   - OUT: Query functions, score computation, validation logic

2. `packages/db/src/schema/project-trends.ts` -- project-level cache table schema
   - Exports: `projectTrends` (pgTable), `projectTrendsRelations` (relations)
   - IN: Table definition, column types, indexes, FK relations
   - OUT: Query functions, score computation, validation logic

3. `packages/db/src/scores/` -- scoring domain services (barrel: `index.ts`)
   - Exports from barrel: `computePopularityScore`, `computeActivityScore`, `computeUsageScore`, `computeRelevanceScore`, `resolvePrimaryPackage`
   - IN: Pure scoring functions, primary package resolution, types consumed by scoring functions
   - OUT: Database access, schema imports, task orchestration, trend computation (that stays in `snapshots/`)

4. `apps/backend/src/tasks/refresh-cache.task.ts` -- daily refresh application service
   - Exports: `refreshCacheTask` (Task)
   - IN: Two-pass orchestration, status filtering, upsert logic, error handling per item, logging
   - OUT: Score formulas (those live in `scores/`), trend computation (reuses `snapshots/computeTrends`), schema definitions

**Section 2: Dependency Graph**

ASCII diagram showing dependency direction between ALL relevant modules (both new and existing that interact with them). Use arrows pointing from dependent to dependency (A --> B means "A depends on B").

The graph should show:
- `refresh-cache.task.ts` --> `scores/` (imports scoring functions)
- `refresh-cache.task.ts` --> `schema/repo-trends.ts` (upserts)
- `refresh-cache.task.ts` --> `schema/project-trends.ts` (upserts)
- `refresh-cache.task.ts` --> `snapshots/compute-trends.ts` (reuses trend computation)
- `refresh-cache.task.ts` --> `projects/project-helpers.ts` (reuses flattenSnapshots)
- `schema/repo-trends.ts` --> `schema/repos.ts` (FK reference)
- `schema/project-trends.ts` --> `schema/projects.ts` (FK reference)
- `scores/` has NO dependencies on schema, db, or any other module (pure functions)
- `scores/relevance.ts` depends conceptually on outputs of other score functions but does NOT import them

Highlight the key architectural property: `scores/` is a leaf node with zero inbound code dependencies (only data dependencies at call sites).

**Section 3: Package.json Exports**

Specify the new `exports` entries needed in `packages/db/package.json`:
- `"./scores": "./src/scores/index.ts"` -- barrel export for all scoring functions
- Schema tables are already accessible via `"./schema"` (the existing barrel at `src/schema/index.ts` will re-export the new tables) -- NO new export entry needed for schema

Note: The backend app (`apps/backend`) imports from `@repo/db` using these paths. Confirm which existing exports it uses and whether new ones are sufficient.

**Section 4: Import Rules (Layering Discipline)**

For each module, state explicit CAN/CANNOT import rules:

| Module | CAN Import | CANNOT Import |
|--------|-----------|--------------|
| `scores/*` | Nothing (pure functions, no imports from project) | `schema/*`, `db`, `drizzle-orm`, `snapshots/*`, `projects/*` |
| `schema/repo-trends.ts` | `schema/repos.ts` (FK ref only) | `scores/*`, `snapshots/*`, `projects/*`, `db` |
| `schema/project-trends.ts` | `schema/projects.ts` (FK ref only) | `scores/*`, `snapshots/*`, `repos.ts`, `db` |
| `refresh-cache.task.ts` | `@repo/db` (schema), `@repo/db/scores`, `@repo/db/snapshots`, task-runner, iteration-helpers | Nothing restricted -- it's the top-level orchestrator |

Explain the rationale: scores/ being import-free is what makes them trivially testable via `bun:test` without database fixtures.

**Section 5: Cross-Cutting Concerns**

Document where shared types and constants land:
- `TrendDeltas` type: defined locally in `scores/popularity.ts` (not shared -- each consumer defines its own compatible interface per structural typing)
- `PackageInfo` type: defined locally in `scores/primary-package.ts`
- `PROJECT_STATUSES` enum: stays in `packages/db/src/constants.ts` (existing), used by refresh task's status filter
- Score column types (integer ranges, nullability): defined by schema, consumed by refresh task

Explain the structural typing approach: scoring functions define their own minimal input types rather than importing from schema. This keeps the dependency arrow pointing the right way (schema depends on nothing, scores depend on nothing, task depends on both).

**Section 6: Future-Proofing Notes**

How do these boundaries accommodate Phase 2-4:
- Phase 2 (Listing Query Module): Will create a new `packages/db/src/listings/` module that READS from `repo_trends` and `project_trends` via joins. It imports schema but NOT scores. The `./scores` export lets listing queries reference score column names if needed for ORDER BY.
- Phase 3 (Web Integration): Web app imports from `@repo/db/listings` (Phase 2 output). No direct import of `scores/` or cache table schemas from the web layer.
- Phase 4 (Validation): Dual-run comparison imports from both `@repo/db/listings` and the static API builder. No boundary changes needed.

Note which boundaries might need revisiting: if listing queries need score recalculation (unlikely -- cache tables are the read model), the scores/ module would gain a new consumer but its interface would not change.
  </action>
  <verify>
    <automated>test -f /home/ubuwarudo/Project/PERSONAL/dev/bestofjs/.planning/quick/3-module-boundary-design-for-phase-1-cache/MODULE-BOUNDARIES.md && wc -l /home/ubuwarudo/Project/PERSONAL/dev/bestofjs/.planning/quick/3-module-boundary-design-for-phase-1-cache/MODULE-BOUNDARIES.md | awk '{if ($1 >= 120) print "PASS: "$1" lines"; else print "FAIL: only "$1" lines"}'</automated>
  </verify>
  <done>MODULE-BOUNDARIES.md exists with all 6 sections: module catalog, dependency graph, package.json exports, import rules, cross-cutting concerns, and future-proofing notes. Document is at least 120 lines and covers every new module from phase 1.</done>
</task>

</tasks>

<verification>
- Document exists and covers all 6 sections
- ASCII dependency graph is present and shows correct arrow directions
- Every new module from phase 1 plans is cataloged
- Import rules table is complete
- Package.json exports entry specified
</verification>

<success_criteria>
- All 4 new modules (2 schema files, scores/ directory, refresh task) have documented boundaries
- Dependency graph shows scores/ as a zero-dependency leaf
- Import rules enforce the layering discipline (scores cannot import schema/db)
- Package.json needs only one new export entry (./scores)
- Future phases (2-4) accommodation is documented
</success_criteria>

<output>
After completion, create `.planning/quick/3-module-boundary-design-for-phase-1-cache/3-SUMMARY.md`
</output>
