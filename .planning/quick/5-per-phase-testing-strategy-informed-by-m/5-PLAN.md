---
phase: quick
plan: 5
type: execute
wave: 1
depends_on: []
files_modified:
  - .planning/quick/5-per-phase-testing-strategy-informed-by-m/TESTING-STRATEGY.md
autonomous: true
requirements: []
must_haves:
  truths:
    - "Each phase has concrete test additions folded into its planning"
    - "Every module boundary has a testing tier assignment"
    - "Integration testing gap is addressed pragmatically"
  artifacts:
    - path: ".planning/quick/5-per-phase-testing-strategy-informed-by-m/TESTING-STRATEGY.md"
      provides: "Per-phase testing strategy with module-level guidance"
      min_lines: 80
  key_links: []
---

<objective>
Create a per-phase testing strategy document that phase planners reference when creating PLAN.md files, covering which module boundaries to test, at what tier, with what framework, and where test files live.

Purpose: Prevent testing gaps in phase planning without creating a separate testing phase. Each phase owns its tests.
Output: TESTING-STRATEGY.md with actionable per-phase guidance.
</objective>

<execution_context>
@/home/ubuwarudo/.claude/get-shit-done/workflows/execute-plan.md
@/home/ubuwarudo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/quick/3-module-boundary-design-for-phase-1-cache/MODULE-BOUNDARIES.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Write per-phase testing strategy document</name>
  <files>.planning/quick/5-per-phase-testing-strategy-informed-by-m/TESTING-STRATEGY.md</files>
  <action>
Create TESTING-STRATEGY.md with the following structure:

**1. Testing Tiers Table**
Map each module boundary to a testing tier:
- `packages/db/src/schema/` (repo-trends, project-trends) -> No tests. TypeScript compilation + successful migration generation is verification enough.
- `packages/db/src/scores/` (5 pure scoring functions) -> Unit tests (bun:test). Co-located: `scores.test.ts` next to source. Already planned in 01-02 TDD plan.
- `apps/backend/src/tasks/refresh-cache.task.ts` -> Manual CLI run against real DB (same pattern as all existing tasks). No unit tests — orchestrator with heavy DB dependencies.
- `packages/db/src/listings/` (Phase 2 query module) -> Integration-style tests using bun:test against real DB. This is the ONE place worth investing in test infrastructure.
- `apps/web/` pages -> Extend existing Playwright e2e smoke tests in `apps/web/tests/e2e/`.
- Phase 4 validation tool -> Custom dual-run comparison (already scoped in roadmap), not a test suite.

**2. Framework assignments**
- Unit: `bun:test` — co-located `*.test.ts` files, inline fixtures, no mocking
- Query integration: `bun:test` — same framework but tests run queries against real dev DB (document the `DATABASE_URL` requirement)
- E2E: Playwright — extend existing `apps/web/tests/e2e/` smoke tests

**3. Per-Phase Test Additions**
For each phase, list the specific tests that should be folded into phase planning:

Phase 1 (Cache Foundation):
- scores/ unit tests: ~10-15 test cases across 5 scoring functions (already in 01-02 TDD plan)
- Schema: no tests needed (TypeScript + migration is the test)
- Refresh task: no automated tests. Verify criteria = run task, check row counts in DB. Document the manual verification command.

Phase 2 (Listing Query Module):
- listings/ query tests: ~15-20 test cases covering:
  - Each of 9 sort options returns correctly ordered results (9 tests)
  - NULL values sort last in descending sorts (2-3 tests)
  - Multi-tag intersection filtering (2-3 tests)
  - ILIKE search across name/description/repo/owner (3-4 tests)
  - Pagination returns correct page + total count (2 tests)
- These run against the real dev DB. Pragmatic approach: tests assume the dev DB has data from a refresh task run. Document the prerequisite.
- File path: `packages/db/src/listings/listings.test.ts`
- No test DB, no seed data, no fixtures — query the same DB the app uses in dev.

Phase 3 (Web Integration):
- Extend Playwright e2e in `apps/web/tests/e2e/`:
  - /projects page loads, shows project cards (~2 tests)
  - Sort selector works, page re-renders with different order (~1 test)
  - Home page sections (hot projects, newest) render (~2 tests)
- Target: 5-6 new Playwright test cases, smoke-level (element visible, correct count range)

Phase 4 (Validation and Cutover):
- No traditional tests. The dual-run comparison tool IS the test.
- Document expected output format so planners know what to build.

**4. Integration Testing Gap — Pragmatic Approach**
Address explicitly: no test DB exists and building one is not worth the investment for this migration. Instead:
- Query tests use the real dev DB (requires `DATABASE_URL` and a prior refresh task run)
- Tests assert ordering/filtering correctness, not exact data values
- Use `LIMIT 10` + relative assertions ("first result has higher score than second") not absolute assertions
- This is pragmatic for a migration project — we are validating query LOGIC, not data content

**5. What Does NOT Need Testing**
Explicitly list to prevent over-testing:
- Drizzle schema definitions (TypeScript compiler is the test)
- Task registration/CLI wiring (trivial glue code)
- Component styling (visual, not behavioral)
- Static JSON API (unchanged, out of scope)
- Package.json exports (verified by downstream import)

**6. Test Count Targets**
| Module | Framework | Test Count | Phase |
|--------|-----------|------------|-------|
| scores/ | bun:test | 10-15 | 1 |
| listings/ | bun:test | 15-20 | 2 |
| web e2e | Playwright | 5-6 | 3 |
| validation | custom tool | n/a | 4 |
| Total | | ~30-40 | |

Keep the document under 150 lines. No preamble, no philosophy — just the tables, the per-phase lists, and the integration gap explanation.
  </action>
  <verify>
    <automated>wc -l .planning/quick/5-per-phase-testing-strategy-informed-by-m/TESTING-STRATEGY.md | awk '{if ($1 >= 80 && $1 <= 200) print "OK: " $1 " lines"; else print "FAIL: " $1 " lines"}'</automated>
  </verify>
  <done>TESTING-STRATEGY.md exists with testing tier assignments for all module boundaries, per-phase test additions, framework assignments, file paths, test count targets, and integration gap addressed</done>
</task>

</tasks>

<verification>
- Document covers all 4 phases with specific test additions
- Every module boundary from quick task 3 has a testing tier assignment
- Integration testing gap is addressed with pragmatic real-DB approach
- Frameworks match existing patterns (bun:test, Playwright)
- File paths are concrete, not abstract
</verification>

<success_criteria>
TESTING-STRATEGY.md exists and can be referenced by phase planners to know exactly what tests to include in each phase's PLAN.md files.
</success_criteria>

<output>
After completion, create `.planning/quick/5-per-phase-testing-strategy-informed-by-m/5-SUMMARY.md`
</output>
