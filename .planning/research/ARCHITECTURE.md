# Architecture Patterns

**Domain:** Database-backed listing migration for Best of JS
**Researched:** 2026-04-09

## Current Architecture (Before Migration)

```
Daily Task (backend)
  |
  v
build-static-api.task.ts
  |-- Reads: projects, repos, snapshots, packages, tags from DB
  |-- Computes: trends (daily/weekly/monthly/yearly) per repo via computeTrends()
  |-- Filters: shouldIncludeProjectInMainList() (cold/inactive/promoted logic)
  |-- Writes: projects.json (~2K projects), projects-full.json (~3.5K)
  |
  v
Static JSON files (public/data/ or remote CDN)
  |
  v
api-local-json.ts / api-remote-json.ts
  |-- Loads entire JSON into memory (cached singleton)
  |
  v
create-api.tsx (API factory)
  |-- Wraps: getData() -> projectCollection, tagCollection, tagsByKey
  |-- Returns: { projects: projectsAPI, tags: tagsAPI, rankings: rankingsAPI }
  |
  v
api-projects.tsx (mingo queries on in-memory array)
  |-- findProjects(): mingo.find(criteria).sort(sort) -> slice(skip, limit)
  |-- findOne(): mingo.Query -> cursor.limit(1)
  |-- getProjectBySlug(): direct lookup on projectsBySlug map
  |-- getSearchIndex(): mingo.find with projection, sorted by stars
  |
  v
Page components (Server Components)
  |-- /projects: fetchPageData -> api.projects.findProjects + api.tags.findTags
  |-- /(home): api.projects.findProjects (hot/newest) + api.tags.findTags
  |-- /tags: api.tags.findTagsWithProjects
```

**Key observation:** The current flow computes trends at build time (daily task), flattens everything into a single JSON, then queries it with mingo. The migration replaces the mingo query layer with DB queries against pre-computed cache tables, but the trend computation logic stays the same -- it just runs into DB tables instead of JSON.

## Recommended Architecture (After Migration)

### Component Boundaries

| Component | Location | Responsibility | Communicates With |
|-----------|----------|---------------|-------------------|
| **Cache table schemas** | `packages/db/src/schema/` | Define `repo_trends` and `project_trends` tables | Drizzle migration system |
| **Score functions** | `packages/db/src/scores/` | Pure functions: popularity_score, activity_score, usage_score, relevance_score | Called by refresh task and listing queries |
| **Cache refresh task** | `apps/backend/src/tasks/` | Daily task that populates cache tables from snapshots + packages | Reads: repos, snapshots, packages. Writes: repo_trends, project_trends |
| **Listing query module** | `packages/db/src/listings/` | DB-backed replacements for mingo queries (findProjects, findTags, etc.) | Reads: projects, repos, tags, repo_trends, project_trends |
| **Web API adapter** | `apps/web/src/server/` | New `api-database.ts` that implements same interface as `create-api.tsx` | Calls listing query module via `@repo/db` |
| **Dual-run validator** | `apps/web/src/server/` or standalone script | Compares static JSON results vs DB results for parity | Calls both old and new API paths |

### Data Flow (Post-Migration)

```
                     WRITE PATH (daily)
                     ==================

Daily GitHub/npm tasks (existing)
  |
  v
repos.stars, snapshots.months, packages.downloads  (already populated)
  |
  v
refresh-score-cache.task.ts  (NEW daily task, runs after existing tasks)
  |
  |-- For each repo:
  |     Read snapshots -> computeTrends() [reuse existing function]
  |     Write to repo_trends: { repo_id, daily, weekly, monthly, yearly, stars }
  |
  |-- For each project:
  |     Read primary package downloads (MAX monthly_downloads)
  |     Compute: popularity_score, activity_score, usage_score, relevance_score
  |     Write to project_trends: { project_id, popularity_score, activity_score,
  |                                 usage_score, relevance_score, downloads,
  |                                 npm_package }
  |
  |-- Update: last_refreshed timestamp
  |
  v
repo_trends + project_trends tables (~350KB combined, ~3.5K rows each)


                     READ PATH (per request)
                     =======================

Page component (e.g., /projects?sort=daily&tags=react)
  |
  v
api-database.ts  (NEW, same interface as create-api.tsx)
  |
  v
listings/findProjects()  (NEW Drizzle query)
  |
  |-- SELECT from projects
  |     JOIN repos ON projects.repoId = repos.id
  |     JOIN repo_trends ON repos.id = repo_trends.repo_id
  |     JOIN project_trends ON projects.id = project_trends.project_id
  |     LEFT JOIN projects_to_tags (for tag filtering/aggregation)
  |
  |-- WHERE:
  |     status NOT IN ('deprecated', 'hidden')
  |     relevance_score >= threshold  (quality floor)
  |     tag filtering via subquery (existing pattern from find.ts)
  |     ILIKE search (existing pattern from find.ts)
  |
  |-- ORDER BY:
  |     sort=daily     -> repo_trends.daily DESC
  |     sort=weekly    -> repo_trends.weekly DESC
  |     sort=monthly   -> repo_trends.monthly DESC
  |     sort=yearly    -> repo_trends.yearly DESC
  |     sort=total     -> repos.stars DESC (popularity_score)
  |     sort=downloads -> project_trends.downloads DESC
  |     sort=last-commit -> repos.last_commit DESC
  |     sort=contributors -> repos.contributor_count DESC
  |     sort=created   -> repos.created_at ASC
  |     sort=newest    -> projects.createdAt DESC
  |
  |-- LIMIT/OFFSET for pagination
  |
  v
Return: { projects, total, selectedTags, relevantTags }
```

### Cache Table Design

```sql
-- repo_trends: one row per repo, refreshed daily
-- Stores pre-computed star deltas so listing queries avoid snapshot traversal
CREATE TABLE repo_trends (
  repo_id        TEXT PRIMARY KEY REFERENCES repos(id) ON DELETE CASCADE,
  stars          INTEGER NOT NULL,          -- current star count (denormalized)
  daily          INTEGER,                   -- stars gained yesterday
  weekly         INTEGER,                   -- stars gained last 7 days
  monthly        INTEGER,                   -- stars gained last 30 days
  quarterly      INTEGER,                   -- stars gained last 90 days
  yearly         INTEGER,                   -- stars gained last 365 days
  refreshed_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- project_trends: one row per project, refreshed daily
-- Stores multi-dimensional scores and primary package data
CREATE TABLE project_trends (
  project_id       TEXT PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  popularity_score REAL NOT NULL DEFAULT 0, -- f(stars)
  activity_score   REAL NOT NULL DEFAULT 0, -- f(daily, weekly, monthly trends)
  usage_score      REAL NOT NULL DEFAULT 0, -- f(downloads); 0 if no package
  relevance_score  REAL NOT NULL DEFAULT 0, -- composite quality floor
  downloads        INTEGER,                 -- primary package monthly downloads
  npm_package      TEXT,                    -- primary package name
  refreshed_at     TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Drizzle Schema (TypeScript)

```typescript
// packages/db/src/schema/repo-trends.ts
export const repoTrends = pgTable("repo_trends", {
  repoId:      text("repo_id").primaryKey()
                 .references(() => repos.id, { onDelete: "cascade" }),
  stars:       integer("stars").notNull(),
  daily:       integer("daily"),
  weekly:      integer("weekly"),
  monthly:     integer("monthly"),
  quarterly:   integer("quarterly"),
  yearly:      integer("yearly"),
  refreshedAt: timestamp("refreshed_at").notNull().defaultNow(),
});

// packages/db/src/schema/project-trends.ts
export const projectTrends = pgTable("project_trends", {
  projectId:       text("project_id").primaryKey()
                     .references(() => projects.id, { onDelete: "cascade" }),
  popularityScore: real("popularity_score").notNull().default(0),
  activityScore:   real("activity_score").notNull().default(0),
  usageScore:      real("usage_score").notNull().default(0),
  relevanceScore:  real("relevance_score").notNull().default(0),
  downloads:       integer("downloads"),
  npmPackage:      text("npm_package"),
  refreshedAt:     timestamp("refreshed_at").notNull().defaultNow(),
});
```

### Score Functions Design

```typescript
// packages/db/src/scores/index.ts
// Pure functions, no DB access. Testable in isolation.

export function popularityScore(stars: number): number {
  // Log-scaled star count. Prevents React/Vue from dominating everything.
  // E.g., log10(50000) = 4.7, log10(500) = 2.7
  return stars > 0 ? Math.log10(stars) : 0;
}

export function activityScore(trends: {
  daily?: number; weekly?: number; monthly?: number; yearly?: number;
}): number {
  // Weighted recent activity. Daily has highest weight.
  const d = trends.daily ?? 0;
  const w = trends.weekly ?? 0;
  const m = trends.monthly ?? 0;
  const y = trends.yearly ?? 0;
  return d * 5 + w * 2 + m * 0.5 + y * 0.05;
}

export function usageScore(monthlyDownloads: number | null): number {
  // Log-scaled downloads. Null/0 = score 0.
  if (!monthlyDownloads || monthlyDownloads <= 0) return 0;
  return Math.log10(monthlyDownloads);
}

export function relevanceScore(params: {
  popularityScore: number;
  activityScore: number;
  usageScore: number;
  hasPackage: boolean;
  status: string;
}): number {
  // Composite quality floor. Projects below threshold excluded from listings.
  // Weights adjusted based on whether project has a package.
  const { popularityScore: pop, activityScore: act, usageScore: use, hasPackage, status } = params;

  // Promoted/featured always relevant
  if (status === "promoted" || status === "featured") return 100;

  if (hasPackage) {
    return pop * 0.3 + act * 0.3 + use * 0.4;
  }
  // No package: ignore usage, reweight
  return pop * 0.5 + act * 0.5;
}
```

### API Adapter Pattern

The key architectural decision: the new DB-backed API implements the exact same interface as the existing `createAPI()` factory, making the swap transparent to page components.

```typescript
// apps/web/src/server/api-database.ts
// Implements the same return type as create-api.tsx

export function createDatabaseAPI() {
  return {
    projects: {
      async findProjects(params) {
        // Translate mingo-style query params to Drizzle query
        // { criteria: { tags: { $all: ["react"] } }, sort: { "trends.daily": -1 } }
        // becomes:
        // WHERE tag IN subquery, ORDER BY repo_trends.daily DESC
      },
      async findOne(criteria) { /* ... */ },
      async getProjectBySlug(slug) { /* ... */ },
      async findRandomFeaturedProjects(params) { /* ... */ },
      async getStats() { /* ... */ },
      async getSearchIndex() { /* ... */ },
    },
    tags: {
      async findTags(params) { /* ... */ },
      async findTagsWithProjects(params) { /* ... */ },
      async getTagBySlug(slug) { /* ... */ },
    },
    rankings: {
      async getMonthlyRankings(params) { /* ... */ },
    },
  };
}
```

### Dual-Run Validation Strategy

During migration, both paths run in parallel to verify parity:

```
Page request
  |
  +---> api-local-json (existing, primary) --> response to user
  |
  +---> api-database (new, shadow) --> logged comparison
          |
          v
        Compare: order of projects, total counts, tag counts
        Log: mismatches with details for debugging
```

This runs as a middleware or wrapper, not as a permanent feature. Remove once confidence is established.

## Patterns to Follow

### Pattern 1: Query Parameter Translation Layer
**What:** A mapping function that converts the existing mingo-style query format (`{ criteria, sort, skip, limit }`) to Drizzle SQL queries.
**When:** Every listing endpoint.
**Why:** Page components already use the mingo query format extensively (`sort: { "trends.daily": -1 }`, `criteria: { tags: { $all: [...] } }`). Translating at the adapter boundary means zero changes to page components.

```typescript
// Map mingo sort keys to Drizzle columns
const SORT_KEY_MAP = {
  "stars":             () => desc(repos.stars),
  "trends.daily":      () => desc(repoTrends.daily),
  "trends.weekly":     () => desc(repoTrends.weekly),
  "trends.monthly":    () => desc(repoTrends.monthly),
  "trends.yearly":     () => desc(repoTrends.yearly),
  "downloads":         () => desc(projectTrends.downloads),
  "pushed_at":         () => desc(repos.last_commit),
  "contributor_count": () => desc(repos.contributor_count),
  "created_at":        () => asc(repos.created_at),
  "added_at":          () => desc(projects.createdAt),
};
```

### Pattern 2: Relevant Tags via DB Aggregation
**What:** Replace the in-memory `getResultRelevantTags()` (counts tag occurrences across filtered results) with a SQL aggregation.
**When:** `/projects` page with tag filtering.
**Why:** The current approach iterates all filtered projects in JS to count tags. The DB can do this in a single query with `GROUP BY` + `COUNT`.

```sql
-- After the main listing query establishes the filtered set,
-- get relevant tags with counts:
SELECT t.code, t.name, COUNT(*) as project_count
FROM projects_to_tags ptt
JOIN tags t ON ptt.tag_id = t.id
WHERE ptt.project_id IN (/* filtered project IDs */)
  AND t.code NOT IN (/* already selected tags */)
GROUP BY t.code, t.name
ORDER BY project_count DESC
LIMIT 20;
```

### Pattern 3: Reuse Existing `packages/db` Patterns
**What:** Follow the established query structure in `packages/db/src/projects/find.ts`.
**When:** All new listing queries.
**Why:** The repo already has a mature pattern for Drizzle queries with joins, tag subqueries, ILIKE search, and relevance-based sorting. The new listing queries should extend this, not reinvent it.

Key patterns to reuse:
- Tag filtering via `getWhereClauseSearchByTag()` subquery pattern
- Text search via `getWhereClauseSearchByText()` ILIKE pattern
- Relevance-based sort via CASE expressions (for text search)
- `groupBy` with `json_agg` for tag aggregation

### Pattern 4: Cache Table as Materialized View Equivalent
**What:** Use regular tables with a daily UPSERT refresh rather than PostgreSQL materialized views.
**When:** For `repo_trends` and `project_trends`.
**Why:** Drizzle ORM has limited materialized view support. Regular tables with `ON CONFLICT DO UPDATE` give the same result with full Drizzle type safety and migration support. The daily refresh task does a bulk upsert.

```typescript
// Refresh pattern: bulk upsert
await db.insert(repoTrends)
  .values(allRepoTrendRows)
  .onConflictDoUpdate({
    target: repoTrends.repoId,
    set: { daily, weekly, monthly, quarterly, yearly, stars, refreshedAt: new Date() },
  });
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Computing Trends at Query Time
**What:** Reading snapshots and calling `computeTrends()` during a listing request.
**Why bad:** Each project requires traversing up to 365 days of snapshot data. For 2K+ projects this is catastrophically slow at query time. The entire point of cache tables is to pre-compute this.
**Instead:** Always read from `repo_trends`. Only `computeTrends()` runs during the daily refresh task.

### Anti-Pattern 2: Changing the API Interface During Migration
**What:** Redesigning the return types or query parameters for page components simultaneously with the DB migration.
**Why bad:** Creates a two-front migration (data source + API shape). Bugs become impossible to attribute.
**Instead:** Keep the exact same `findProjects()` interface. The adapter translates. Refactor the API surface later as a separate effort.

### Anti-Pattern 3: Eager Loading All Joins
**What:** A single mega-query that joins projects + repos + repo_trends + project_trends + tags + packages for every request.
**Why bad:** Different endpoints need different data. The `/tags` page needs tag counts, not per-project trend details. The home page needs top 5 by one sort, not the full join.
**Instead:** Build composable query fragments. The listing module offers focused queries per use case.

### Anti-Pattern 4: Replacing the Search Palette Data Source
**What:** Trying to make the search palette use DB queries for its client-side autocomplete.
**Why bad:** The search palette (`getSearchIndex()`) serves a preloaded client-side dataset for instant filtering. This is explicitly out of scope and works differently from listing queries.
**Instead:** Keep `getSearchIndex()` returning from static JSON or a simple DB query with projection. Do not conflate it with the listing migration.

## Build Order (Dependencies)

```
Phase 1: Cache Table Foundation
  |- Schema: repo_trends, project_trends tables + migration
  |- Score functions: pure functions in packages/db/src/scores/
  |- Refresh task: daily task that populates cache tables
  |
  | (No web app changes. Tables exist but nothing reads them yet.)
  |
Phase 2: Listing Query Module
  |- packages/db/src/listings/ query functions
  |- Sort key mapping (mingo keys -> Drizzle columns)
  |- Tag filtering (reuse existing subquery pattern)
  |- Text search (reuse existing ILIKE pattern)
  |- Relevance floor filtering (WHERE relevance_score >= threshold)
  |- Relevant tags aggregation
  |
  | (Still no web app changes. Query module is testable in isolation.)
  |
Phase 3: Web API Adapter + Dual-Run
  |- api-database.ts implementing same interface as create-api.tsx
  |- Query parameter translation (mingo format -> listing module)
  |- Dual-run comparison: static JSON vs DB results
  |- Feature flag to switch between static and DB
  |
  | (Web app can toggle between old and new. Pages unchanged.)
  |
Phase 4: Server-Side Search
  |- Search for... command palette path hits DB instead of static JSON
  |- ILIKE search on projects.name, description, repos.name, repos.owner
  |- Relevance ranking via CASE expression (already exists in find.ts)
  |
Phase 5: Cutover + Cleanup
  |- Make DB the primary data source (flip feature flag)
  |- Remove dual-run validation
  |- Static JSON continues to be built (legacy consumers)
```

**Critical dependency chain:**
- Phase 2 depends on Phase 1 (queries need cache tables to exist with data)
- Phase 3 depends on Phase 2 (adapter wraps query module)
- Phase 4 is independent of Phase 3 (can be built in parallel)
- Phase 5 depends on Phase 3 proving parity

## Scalability Considerations

| Concern | At 3.5K projects (now) | At 10K projects | At 50K projects |
|---------|------------------------|-----------------|-----------------|
| Cache table size | ~350KB, sub-ms queries | ~1MB, still sub-ms | ~5MB, add indexes on score columns |
| Daily refresh | <10 seconds | ~30 seconds | Minutes; consider batch upserts |
| Listing query | Simple JOIN, <5ms | Same, unchanged | Add composite indexes (status, sort columns) |
| Tag aggregation | Trivial | Monitor | May need pre-computed tag counts |
| Search (ILIKE) | Fine | Fine | Consider pg_trgm GIN index |

At current scale (3.5K projects), performance is a non-issue. The architecture is designed to be correct first. Optimization (pg_trgm, partial indexes, connection pooling) can be added when data volume warrants it.

## Sources

- Codebase analysis: `packages/db/src/schema/` (existing Drizzle schema)
- Codebase analysis: `packages/db/src/projects/find.ts` (existing DB query patterns)
- Codebase analysis: `apps/web/src/server/` (current static JSON API layer)
- Codebase analysis: `apps/backend/src/tasks/build-static-api.task.ts` (current trend computation)
- Codebase analysis: `packages/db/src/snapshots/compute-trends.ts` (trend algorithm)
- PROJECT.md specifications for cache table design and scoring system
