# Phase 1: Cache Foundation - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Create `repo_trends` and `project_trends` cache tables with Drizzle schema, implement four scoring functions (popularity_score, activity_score, usage_score, relevance_score), and build a daily refresh task that populates both tables. This is the foundation — no listing queries or web integration in this phase.

</domain>

<decisions>
## Implementation Decisions

### Schema design
- Two separate cache tables: `repo_trends` (keyed by `repo_id`) and `project_trends` (keyed by `project_id`)
- `repo_trends` stores: stars, daily/weekly/monthly/quarterly/yearly trend deltas, popularity_score (signed), activity_score (0–100)
- `project_trends` stores: package_name, monthly_downloads, usage_score (0–100), relevance_score (signed)
- All score columns are INTEGER NOT NULL DEFAULT 0; trend delta columns are nullable INTEGER (NULL = cannot compute, 0 = computed but zero)
- Both tables use TEXT PRIMARY KEY with foreign key references and ON DELETE CASCADE
- Descending indexes on all sort-relevant columns; trend columns use NULLS LAST in indexes

### Scoring formulas
- `popularity_score`: signed log scale of blended star trends — `Math.sign(raw) * Math.log10(1 + Math.abs(raw) / 10) * 30` where `raw = yearly + monthly*6 + daily*180`. Range: ~-100 to +100
- `activity_score`: `100 - Math.log2(days + 1) * 10` base + `Math.min(10, Math.log2(contributors) * 3)` bonus. Range: 0–100. 0 if no last_commit
- `usage_score`: `(Math.log10(downloads) - 2) * 20`, clamped 0–100. 0 if no package data
- `relevance_score`: weighted blend — with package: `pop*0.5 + act*0.25 + usage*0.25`; without package: `pop*0.65 + act*0.35`
- All formulas are pure functions, tunable without schema changes

### Daily refresh task
- New task created alongside existing `buildStaticApiTask` using `createTask({ name, description, run })` pattern
- Two passes: Pass 1 per-repo (deduplicated), Pass 2 per-project
- Pass 1: query distinct repos linked to active/featured/promoted projects, compute trends via existing `computeTrends(flattenSnapshots())`, compute popularity_score and activity_score, upsert into repo_trends
- Pass 2: for each active/featured/promoted project, resolve primary package (highest monthly downloads), compute usage_score and relevance_score using repo's scores, upsert into project_trends
- Deprecated project repos excluded from both passes (reduces GitHub API cost and keeps cache clean)
- Use `db.insert().values().onConflictDoUpdate()` for upserts (existing pattern in codebase)

### Primary package resolution
- Pick the package with highest `monthlyDownloads` for each project
- Projects with 0 packages: `usage_score = 0`, `package_name = NULL`, `monthly_downloads = NULL`
- Relevance formula redistributes weight for no-package projects (0.65/0.35 instead of 0.5/0.25/0.25)

### Status policy
- `deprecated`: hard exclude from cache population and star tracking
- `active`, `featured`, `promoted`: included in cache population
- Eligibility query: `WHERE p.status IN ('active', 'featured', 'promoted')`

### Claude's Discretion
- Drizzle migration file naming and structure
- Whether to batch upserts or process one-by-one (performance choice for ~3.5K rows)
- Error handling within the refresh task (retry strategy, partial failure handling)
- Whether to log score distribution stats after refresh for tuning visibility
- Test structure and fixtures for scoring functions

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `computeTrends()` at `packages/db/src/snapshots/compute-trends.ts`: Already computes daily/weekly/monthly/quarterly/yearly deltas from snapshots. Reuse directly in Pass 1
- `flattenSnapshots()` at `packages/db/src/snapshots/utils.ts`: Flattens year/month/day snapshot structure into flat array. Required input for `computeTrends()`
- `getProjectTrends()` at `packages/db/src/projects/project-helpers.ts`: Wrapper that calls computeTrends on flattened snapshots. May be reusable or serve as reference
- `createTask()` factory at `apps/backend/src/tasks/`: Task creation pattern used by `buildStaticApiTask`. Use same pattern for refresh task

### Established Patterns
- **Schema**: Drizzle `pgTable()` with `text()` PKs, `integer()` columns, `timestamp()` with `.defaultNow()`, `relations()` defined separately with `one()`/`many()`
- **Barrel exports**: All schemas re-exported from `packages/db/src/schema/index.ts`
- **Snapshots**: Stored as JSONB per year with composite PK `(repoId, year)`. Must be flattened before trend computation
- **Task context**: Tasks receive `{ db, logger, processProjects, saveJSON }` — db is the Drizzle instance
- **Upsert pattern**: `db.insert().values().onConflictDoUpdate()` used in daily-featured-projects

### Integration Points
- New schema files: `packages/db/src/schema/repo-trends.ts` and `project-trends.ts`, added to `schema/index.ts` barrel
- New task file: `apps/backend/src/tasks/` directory, registered alongside existing tasks
- Relations: `repo_trends.repoId` → `repos.id`, `project_trends.projectId` → `projects.id`
- Scoring functions: new module in `packages/db/src/` (e.g., `scores/` or `trends/`) — pure functions, no DB dependency

</code_context>

<specifics>
## Specific Ideas

- Scoring formulas are fully specified in the idea document with exact TypeScript implementations and example profiles — implement as written, tune later with real data
- The `quarterly` trend window is included in the schema even though no current sort option uses it — keep it for future flexibility (low cost, one extra column)
- Monorepo deduplication is critical: the `repos (1) ←── (N) projects` relationship means `repo_trends` must compute once per repo, not once per project

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-cache-foundation*
*Context gathered: 2026-04-09*
