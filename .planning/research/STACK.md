# Technology Stack

**Project:** Migrate Best of JS Web Listings to Database Queries
**Researched:** 2026-04-09

## Current Stack (Locked In)

These are already in the monorepo and are not up for debate. The migration builds on top of them.

| Technology | Version (installed) | Purpose |
|------------|---------------------|---------|
| Next.js | 16.1.7 | Web app framework (App Router, Turbopack, Server Components) |
| Drizzle ORM | 0.44.5 | Type-safe SQL query builder and schema definitions |
| Drizzle Kit | 0.31.4 | Schema migrations and studio |
| PostgreSQL | (Vercel Postgres / Neon) | Primary database |
| @vercel/postgres | 0.10.0 | Serverless Postgres driver for Vercel deployments |
| @neondatabase/serverless | 0.9.5 | WebSocket-based Postgres driver for local dev |
| Zod | 4.1.8 | Runtime validation for query params, API contracts |
| TypeScript | 5.9.2 | Type safety across monorepo |
| pnpm | 10.15.0 | Package manager with workspace catalog |
| Turborepo | 2.5.6 | Monorepo build orchestration |
| Biome | 2.1.1 | Linting and formatting |

## Recommended Stack Additions

### Cache Table Schema (Drizzle ORM)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| drizzle-orm `pgTable` | 0.44.5 (current) | Define `repo_trends` and `project_trends` as regular tables | Regular tables over materialized views because: (1) Drizzle Kit still has incomplete migration support for materialized views -- custom migration flag required and no introspect support; (2) regular tables give full Drizzle query builder and relation support; (3) daily refresh via INSERT...ON CONFLICT is simpler than REFRESH MATERIALIZED VIEW CONCURRENTLY; (4) at ~3,500 rows, materialized view performance advantages are zero |
| `sql` template tag from drizzle-orm | 0.44.5 | Raw SQL for scoring formulas in SELECT and ORDER BY | Scoring functions (popularity, activity, usage, relevance) involve CASE expressions and math that are cleaner as raw SQL fragments than chained Drizzle helpers |

**Confidence:** HIGH -- verified against codebase and Drizzle docs. Regular tables are the correct choice for this data volume and refresh pattern.

### Query Layer

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Drizzle relational queries (`db.query.*`) | 0.44.5 | Simple single-entity lookups (project detail pages) | Already used in `ProjectService.getProjectByKey`; keeps consistency |
| Drizzle SQL-like select API (`db.select()`) | 0.44.5 | Complex listing queries with joins, aggregations, dynamic sort | Already used in `findProjects`; gives full control over JOIN, GROUP BY, ORDER BY, subqueries. Required for cache table joins and dynamic sort columns |
| `and()`, `or()`, `eq()`, `inArray()`, `ilike()`, `desc()`, `asc()` from drizzle-orm | 0.44.5 | Dynamic WHERE clause composition | Already established pattern in `packages/db/src/projects/find.ts`; compose filter predicates conditionally |

**Confidence:** HIGH -- these are already the established patterns in the codebase.

### Search

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| PostgreSQL `ILIKE` | (built-in) | Text search for command-palette "Search for..." path | Sufficient for ~3,500 projects. Already implemented in `getWhereClauseSearchByText`. No external dependency needed |
| PostgreSQL `pg_trgm` extension | (built-in, activate later) | Future upgrade path for fuzzy/typo-tolerant search | PROJECT.md says "ILIKE first, optional pg_trgm later." Do NOT add pg_trgm now -- it requires CREATE EXTENSION on Vercel Postgres (supported but unnecessary at this scale). Keep as documented upgrade path |

**Confidence:** HIGH -- ILIKE is already working in the codebase. pg_trgm is a well-documented PostgreSQL extension.

### Caching and Data Freshness

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js `cacheLife` (stable in v16) | 16.1.7 | Page-level cache with `daily` profile (already configured) | Already configured in `next.config.ts` with `daily: { stale: 86400, revalidate: 86400 }`. Listing pages should use this profile since cache tables refresh daily |
| Next.js `'use cache'` directive | 16.1.7 | Component-level caching for listing components | Stable in Next.js 16 (no more `unstable_` prefix). Use for expensive listing queries so repeated navigations within a day hit cache |
| `React.Suspense` | 19.2.0 | Streaming SSR for listing pages | Wrap DB-backed listing components in Suspense so the page shell renders immediately while data loads. Already idiomatic in Next.js 16 App Router |

**Confidence:** HIGH -- `cacheLife` profiles already exist in the project's `next.config.ts`.

### Daily Refresh Task

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Existing task runner pattern (Bun + tsx) | current | Run cache refresh alongside `buildStaticApiTask` | PROJECT.md constraint: "Daily refresh task runs alongside existing buildStaticApiTask." Use the same execution pattern (likely Bun script invoked by scheduler). No new task runner needed |
| Drizzle `db.insert().onConflictDoUpdate()` | 0.44.5 | Upsert rows in cache tables | Atomic upsert: INSERT new projects, UPDATE existing ones. Single pass, no need for DELETE + INSERT or TRUNCATE + INSERT. Handles partial failures gracefully |
| PostgreSQL `INSERT...SELECT` via Drizzle `sql` | 0.44.5 | Compute scores from source tables in a single SQL statement | Push computation to the database: one INSERT...SELECT with JOINs and aggregations computes all scores in a single round-trip. Avoids fetching raw data to Node.js and computing in-memory |

**Confidence:** HIGH -- upsert pattern is well-supported in Drizzle. INSERT...SELECT is standard PostgreSQL.

### Validation and Dual-Run

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vitest | 2.1.9 (current) | Unit tests for scoring functions and query correctness | Already the test runner in the web app |
| Custom comparison script | N/A | Dual-run validation: compare static JSON results vs DB query results | PROJECT.md requirement. Build as a simple Node/Bun script that calls both code paths and diffs results. No library needed -- just `JSON.stringify` + deep comparison from `es-toolkit` (already a dependency) |
| `es-toolkit` | 1.39.10 (in @repo/db) | Deep equality comparison for dual-run validation | Already a dependency. Use `isEqual` for comparing result sets |

**Confidence:** HIGH -- straightforward testing approach using existing tools.

## What NOT to Use

| Technology | Why Not |
|------------|---------|
| **Materialized views** (`pgMaterializedView`) | Drizzle Kit migration support is incomplete (requires `--custom` flag, no introspect). Regular tables give identical performance at this scale (~3,500 rows) with full ORM support. Adds complexity for zero benefit |
| **Redis / Upstash** | Data refreshes once daily and is tiny (~350KB total). PostgreSQL cache tables + Next.js `cacheLife` are sufficient. Adding Redis would mean another service to manage, another failure point, and another billing line for no measurable gain |
| **Prisma** | Project already uses Drizzle ORM. Prisma would be a second ORM adding bundle size, different mental model, and migration conflicts |
| **tRPC** | No API layer needed. Server Components query the database directly. Adding tRPC would be unnecessary indirection for what are simple server-side data fetches |
| **pg_trgm (now)** | Premature optimization. ILIKE works fine at current scale. Add pg_trgm only when search quality complaints arise or data exceeds ~10K projects |
| **Drizzle v1 beta** | v1.0.0-beta.x is in active development with breaking changes. Stay on 0.44.x stable. Upgrade to v1 only after stable release |
| **mingo (for new queries)** | The entire point of this migration is to replace mingo with database queries. New listing code must use Drizzle. mingo stays only for legacy paths during dual-run |
| **SWR / React Query (for listings)** | Listing pages are server-rendered with daily cache. Client-side data fetching adds complexity without benefit. SWR is already used in the project for other purposes but should not be used for the new DB-backed listings |
| **External cron service** | The daily refresh should run in the same infrastructure as `buildStaticApiTask`. No need for a separate cron service when the existing task scheduling pattern works |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Cache storage | Regular PostgreSQL tables | Materialized views | Drizzle tooling gaps; zero perf difference at this scale |
| Cache storage | Regular PostgreSQL tables | Redis/Upstash | Over-engineering for daily-refresh, ~350KB data |
| Score computation | Database-side (INSERT...SELECT) | Application-side (fetch + compute in Node) | Extra round-trips, more memory, harder to maintain |
| Search | ILIKE | pg_trgm | Premature; upgrade path documented for later |
| Search | ILIKE | Elasticsearch/Typesense | Massive over-engineering for ~3,500 records |
| Cache refresh | Upsert (ON CONFLICT DO UPDATE) | TRUNCATE + INSERT | Upsert is atomic, handles partial failures, no downtime |
| Page caching | Next.js cacheLife (daily) | ISR with revalidate | `cacheLife` is the Next.js 16 way; ISR `revalidate` is the older API |

## Schema Additions

New tables to add in `packages/db/src/schema/`:

```typescript
// repo-trends.ts
export const repoTrends = pgTable("repo_trends", {
  repoId: text("repo_id").primaryKey().references(() => repos.id, { onDelete: "cascade" }),
  stars: integer("stars"),                    // current star count (denormalized for fast sort)
  dailyChange: integer("daily_change"),       // stars gained today
  weeklyChange: integer("weekly_change"),     // stars gained this week
  monthlyChange: integer("monthly_change"),   // stars gained this month
  yearlyChange: integer("yearly_change"),     // stars gained this year
  popularityScore: integer("popularity_score"),  // computed from stars
  activityScore: integer("activity_score"),      // computed from commits, push recency
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// project-trends.ts
export const projectTrends = pgTable("project_trends", {
  projectId: text("project_id").primaryKey().references(() => projects.id, { onDelete: "cascade" }),
  repoId: text("repo_id").references(() => repos.id),  // denormalized for JOIN-free lookups
  stars: integer("stars"),                     // from repo (denormalized)
  dailyChange: integer("daily_change"),        // from repo (denormalized)
  weeklyChange: integer("weekly_change"),      // from repo
  monthlyChange: integer("monthly_change"),    // from repo
  yearlyChange: integer("yearly_change"),      // from repo
  monthlyDownloads: integer("monthly_downloads"), // from primary package
  popularityScore: integer("popularity_score"),
  activityScore: integer("activity_score"),
  usageScore: integer("usage_score"),          // computed from downloads
  relevanceScore: integer("relevance_score"),  // composite quality floor
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

**Rationale for denormalization:** Listing queries need stars, trend deltas, and scores in a single SELECT without JOINing back to repos/snapshots/packages. At ~3,500 rows refreshed daily, the storage cost is negligible and query simplicity is significant.

## Index Recommendations

```sql
-- project_trends: support ORDER BY for each sort option
CREATE INDEX idx_project_trends_popularity ON project_trends (popularity_score DESC);
CREATE INDEX idx_project_trends_activity ON project_trends (activity_score DESC);
CREATE INDEX idx_project_trends_usage ON project_trends (usage_score DESC);
CREATE INDEX idx_project_trends_daily ON project_trends (daily_change DESC);
CREATE INDEX idx_project_trends_weekly ON project_trends (weekly_change DESC);
CREATE INDEX idx_project_trends_stars ON project_trends (stars DESC);

-- project_trends: support WHERE relevance_score >= threshold
CREATE INDEX idx_project_trends_relevance ON project_trends (relevance_score);
```

**Note:** At ~3,500 rows these indexes are mostly for correctness and future-proofing. PostgreSQL will likely use sequential scans anyway at this scale. Do not over-index.

## Installation

No new packages needed. The entire migration uses existing dependencies:

```bash
# Already installed -- no changes required
# drizzle-orm @ 0.44.5
# drizzle-kit @ 0.31.4
# @vercel/postgres @ 0.10.0
# zod @ 4.1.8
# es-toolkit @ 1.39.10
# vitest @ 2.1.9
```

The only new artifacts are:
1. Two new schema files in `packages/db/src/schema/`
2. A new Drizzle migration (via `pnpm --filter @repo/db generate && pnpm --filter @repo/db migrate`)
3. New query functions in `packages/db/src/projects/`
4. A cache refresh task script

## Connection Management

The project uses `@vercel/postgres` with Neon's WebSocket driver. Key considerations:

- **Vercel Fluid Compute** handles connection pooling automatically for serverless functions
- The existing `VercelPostgresService` class in `packages/db/src/index.ts` manages connections
- Cache refresh tasks (running as standalone scripts via Bun) should use `runQuery()` which properly connects and disconnects
- No connection pool configuration changes needed -- the current setup handles the expected query volume

**Confidence:** HIGH -- Vercel's serverless Postgres driver with Neon handles pooling transparently.

## Sources

- Drizzle ORM docs: https://orm.drizzle.team/docs/views (materialized view limitations)
- Drizzle ORM releases: https://github.com/drizzle-team/drizzle-orm/releases (v0.44.5 stable, v1 beta)
- Next.js 16 upgrade guide: https://nextjs.org/docs/app/guides/upgrading/version-16 (cacheLife stable)
- Vercel connection pooling: https://vercel.com/kb/guide/connection-pooling-with-functions
- PostgreSQL materialized views: https://www.postgresql.org/docs/current/rules-materializedviews.html
- Codebase analysis: `packages/db/src/projects/find.ts`, `packages/db/src/index.ts`, `apps/web/src/server/api-projects.tsx`, `apps/web/next.config.ts`
