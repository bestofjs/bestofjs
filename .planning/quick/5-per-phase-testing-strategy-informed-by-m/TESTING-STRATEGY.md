# Per-Phase Testing Strategy

Each phase owns its tests. This document tells phase planners exactly what tests to include.

---

## 1. Testing Tiers

| Module | Tier | Rationale |
|--------|------|-----------|
| `packages/db/src/schema/repo-trends.ts` | No tests | TypeScript compilation + successful migration generation is verification |
| `packages/db/src/schema/project-trends.ts` | No tests | Same as above -- schema correctness is compiler-verified |
| `packages/db/src/scores/` (5 pure functions) | Unit tests | Pure functions, zero deps -- trivially testable with `bun:test` |
| `packages/db/src/scores/primary-package.ts` | Unit tests | Pure selection logic, same tier as scoring functions |
| `apps/backend/src/tasks/refresh-cache.task.ts` | Manual CLI run | Orchestrator with heavy DB dependencies -- verify via task execution against real DB |
| `packages/db/src/listings/` (Phase 2) | Integration tests | Query module -- the ONE place worth test infrastructure investment |
| `apps/web/` pages | E2E smoke tests | Extend existing Playwright suite in `apps/web/tests/e2e/` |
| Phase 4 validation tool | Custom dual-run | Comparison tool IS the test -- not a test suite |

---

## 2. Framework Assignments

| Tier | Framework | File Convention | Fixtures/Mocking |
|------|-----------|-----------------|------------------|
| Unit | `bun:test` | Co-located `*.test.ts` next to source | Inline literals, no mocking |
| Query integration | `bun:test` | Co-located `*.test.ts` in listings module | Real dev DB via `DATABASE_URL` |
| E2E | Playwright | `apps/web/tests/e2e/*.spec.ts` | Running dev server |

**DATABASE_URL requirement for integration tests:** Query integration tests connect to the real dev PostgreSQL database. They require:
1. `DATABASE_URL` env var set (same one used for local dev)
2. A prior run of `refresh-cache` task to populate cache tables with data

No test database, no seed scripts, no fixtures. Tests query the same DB the app uses in development.

---

## 3. Per-Phase Test Additions

### Phase 1: Cache Foundation

**scores/ unit tests** (~10-15 test cases)
- File: `packages/db/src/scores/popularity.test.ts`
  - Zero stars returns 0
  - Positive trend deltas produce positive score
  - Large star counts use log-scale correctly
  - Negative deltas produce negative score
- File: `packages/db/src/scores/activity.test.ts`
  - Recent commit (< 30 days) scores high
  - Old commit (> 1 year) scores low
  - Null lastCommit returns 0
  - Higher contributor count increases score
- File: `packages/db/src/scores/usage.test.ts`
  - Null downloads returns 0
  - High monthly downloads score near 100
  - Low downloads score proportionally
- File: `packages/db/src/scores/relevance.test.ts`
  - All-zero inputs return 0
  - hasPackage=false adjusts weights (0.65/0.35 split)
  - hasPackage=true uses standard weights (0.5/0.25/0.25)
- File: `packages/db/src/scores/primary-package.test.ts`
  - Empty array returns null
  - Single package returns that package
  - Multiple packages returns highest downloads

Already scoped in 01-02 TDD plan. No additional planning needed.

**Schema:** No tests. TypeScript + migration generation = verification.

**Refresh task:** No automated tests. Manual verification:
```bash
pnpm --filter backend run task refresh-cache
# Then verify: SELECT count(*) FROM repo_trends; SELECT count(*) FROM project_trends;
```

### Phase 2: Listing Query Module

**listings/ query tests** (~15-20 test cases)
- File: `packages/db/src/listings/listings.test.ts`
- Prerequisite: dev DB populated via refresh-cache task run

Sort correctness (9 tests):
- Sort by stars descending returns highest-star projects first
- Sort by daily trend returns highest daily delta first
- Sort by weekly trend returns highest weekly delta first
- Sort by monthly trend returns highest monthly delta first
- Sort by yearly trend returns highest yearly delta first
- Sort by downloads returns highest monthly downloads first
- Sort by last commit returns most recently committed first
- Sort by contributors returns highest contributor count first
- Sort by date added returns newest projects first

NULL handling (2-3 tests):
- NULL trend values sort last in descending order
- NULL download counts sort last when sorting by downloads

Tag filtering (2-3 tests):
- Single tag filter returns only matching projects
- Multi-tag intersection returns projects with ALL tags
- Non-existent tag returns empty results

Search (3-4 tests):
- ILIKE search matches project name substring
- ILIKE search matches description substring
- ILIKE search matches repo owner
- Search is case-insensitive

Pagination (2 tests):
- Page 1 returns `limit` results with correct total count
- Page 2 returns next slice of results

**Test assertion style:** Use relative assertions, not absolute values:
```typescript
// GOOD: relative assertion
expect(results[0].stars).toBeGreaterThanOrEqual(results[1].stars);

// BAD: absolute assertion
expect(results[0].stars).toBe(245000);
```

Use `LIMIT 10` in test queries. Assert ordering relationships between adjacent results.

### Phase 3: Web Integration

**Playwright E2E additions** (~5-6 test cases)
- File: `apps/web/tests/e2e/listings.spec.ts` (new file, extends existing suite)

Tests:
- `/projects` page loads and displays project cards (visible count > 0)
- `/projects` sort selector changes URL and re-renders list
- Home page "Hot Projects" section renders with project cards
- Home page "Newest Projects" section renders with project cards
- Home page "Featured Projects" section renders

Smoke-level only: assert element visibility and reasonable count ranges, not exact data.

### Phase 4: Validation and Cutover

No traditional tests. The dual-run comparison tool IS the validation mechanism.

Expected output format for planners:
```
Sort: stars       | overlap: 95/100 (95%) | PASS
Sort: daily       | overlap: 88/100 (88%) | PASS
Sort: weekly      | overlap: 91/100 (91%) | PASS
...
```

The tool compares top-N results from static JSON vs DB queries per sort option, reporting set overlap percentage.

---

## 4. Integration Testing Gap -- Pragmatic Approach

No test database exists, and building one is not worth the investment for this migration project.

**Strategy:**
- Query tests use the real dev DB (requires `DATABASE_URL` env var)
- Tests require a prior `refresh-cache` task run to populate data
- Assert ordering/filtering correctness via relative comparisons, never absolute data values
- Use `LIMIT 10` + relative assertions ("first result has higher score than second")
- Tests validate query LOGIC (correct ORDER BY, correct WHERE, correct JOIN), not data content

**Why this is acceptable:**
- Cache tables are tiny (~200KB + ~150KB) -- queries are sub-millisecond
- Data volume is stable (~3,500 projects) -- no risk of test timeouts
- Migration project with finite lifespan -- test infrastructure ROI is low
- TypeScript + Drizzle ORM catch schema/type mismatches at compile time

---

## 5. What Does NOT Need Testing

| Item | Why |
|------|-----|
| Drizzle schema definitions | TypeScript compiler verifies types; migration generation verifies SQL |
| Task registration / CLI wiring | Trivial glue code -- `createTask()` call with a name string |
| Component styling | Visual concern, not behavioral -- out of scope for automated tests |
| Static JSON API | Unchanged by this migration, continues to work as-is |
| Package.json exports | Verified by downstream import -- TypeScript compiler catches breaks |
| Score formula constants | Implementation details of pure functions -- tested via function behavior |

---

## 6. Test Count Targets

| Module | Framework | Test Count | Phase | File Path |
|--------|-----------|------------|-------|-----------|
| `scores/` | `bun:test` | 10-15 | 1 | `packages/db/src/scores/*.test.ts` |
| `listings/` | `bun:test` | 15-20 | 2 | `packages/db/src/listings/listings.test.ts` |
| web e2e | Playwright | 5-6 | 3 | `apps/web/tests/e2e/listings.spec.ts` |
| validation | custom tool | n/a | 4 | `apps/backend/src/tasks/validate-parity.task.ts` |
| **Total** | | **~30-40** | | |
