---
phase: quick
plan: 5
subsystem: testing
tags: [bun-test, playwright, testing-strategy, migration]

requires:
  - phase: quick-3
    provides: Module boundary design with all module catalog entries
provides:
  - Per-phase testing strategy document for phase planners
  - Testing tier assignments for all module boundaries
  - Test count targets and file path conventions
affects: [phase-1, phase-2, phase-3, phase-4]

tech-stack:
  added: []
  patterns: [co-located-tests, relative-assertions, real-db-integration-tests]

key-files:
  created:
    - .planning/quick/5-per-phase-testing-strategy-informed-by-m/TESTING-STRATEGY.md
  modified: []

key-decisions:
  - "Real dev DB for integration tests instead of test DB or fixtures"
  - "Relative assertions (ordering relationships) instead of absolute data values"
  - "No tests for schema, task wiring, component styling, static JSON API, or package.json exports"

patterns-established:
  - "Co-located tests: *.test.ts next to source files for unit and integration tests"
  - "Smoke-level E2E: assert element visibility and count ranges, not exact data"
  - "Test prerequisite: refresh-cache task run before integration tests"

requirements-completed: []

duration: 3min
completed: 2026-04-09
---

# Quick Task 5: Per-Phase Testing Strategy Summary

**Testing strategy mapping all module boundaries to tiers (unit/integration/e2e/manual/none) with ~30-40 test target across 4 phases**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-09T11:50:31Z
- **Completed:** 2026-04-09T11:53:31Z
- **Tasks:** 1
- **Files created:** 1

## Accomplishments
- Testing tier assignments for all 8 module boundaries from quick task 3
- Per-phase test additions with specific test cases, file paths, and count targets (10-15 unit, 15-20 integration, 5-6 e2e)
- Pragmatic integration testing approach using real dev DB with relative assertions instead of test DB infrastructure
- Explicit "what does NOT need testing" list to prevent over-engineering

## Task Commits

1. **Task 1: Write per-phase testing strategy document** - `c45e57cd` (docs)

## Files Created/Modified
- `.planning/quick/5-per-phase-testing-strategy-informed-by-m/TESTING-STRATEGY.md` - Testing strategy with tier assignments, framework mappings, per-phase test lists, and integration gap approach

## Decisions Made
- Real dev DB for query integration tests (no test database, no seed data, no fixtures) -- pragmatic for a migration project with finite lifespan
- Relative assertions over absolute values -- tests validate query LOGIC not data content
- Explicit exclusion list prevents planners from over-testing schema definitions, task wiring, and static JSON API

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase planners can reference TESTING-STRATEGY.md when creating PLAN.md files
- Phase 1 scoring tests (01-02) already aligned with this strategy
- Phase 2 listing query tests need DATABASE_URL and prior refresh-cache run documented as prerequisites

---
*Quick task: 5*
*Completed: 2026-04-09*
