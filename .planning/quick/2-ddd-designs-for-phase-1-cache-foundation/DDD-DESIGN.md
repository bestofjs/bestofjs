# DDD Design: Phase 1 Cache Foundation

A domain-driven design mapping for the bestofjs phase 1 cache foundation, applying Eric Evans' concepts to the scoring, caching, and refresh architecture.

---

## 1. Bounded Contexts

Phase 1 operates across two bounded contexts that share a database (Shared Kernel pattern):

**Project Catalog** (existing core context)
- Owns: `projects`, `repos`, `packages`, `snapshots`, `tags`
- Responsible for: project identity, repo metadata, star tracking, package registry data
- Language: "project," "repo," "package," "snapshot," "tag," "status"
- Files: `packages/db/src/schema/repos.ts`, `projects.ts`, `packages.ts`, `snapshots.ts`

**Trend Analytics** (new in phase 1)
- Owns: `repo_trends`, `project_trends` cache tables, scoring functions
- Responsible for: computing and caching trend deltas, popularity/activity/usage/relevance scores
- Language: "trend delta," "popularity score," "cache refresh," "primary package"
- Files: `packages/db/src/schema/repo-trends.ts`, `project-trends.ts`, `packages/db/src/scores/`

**Context relationship:** Trend Analytics is a *downstream consumer* of Project Catalog. It reads from `repos`, `projects`, `packages`, and `snapshots` but never writes to them. The cache tables are projections -- derived read models that Trend Analytics owns exclusively.

The two contexts share the same PostgreSQL database (Shared Kernel), which is pragmatic at bestofjs's scale (~3.5K projects). A formal anti-corruption layer between contexts would be over-engineering. Instead, the boundary is maintained by convention: scoring functions and the refresh task treat Project Catalog entities as read-only inputs.

```
+---------------------------+       reads from       +---------------------------+
|    PROJECT CATALOG        |  <-------------------  |    TREND ANALYTICS        |
|                           |                        |                           |
|  repos                    |                        |  repo_trends (projection) |
|  projects                 |                        |  project_trends (proj.)   |
|  packages                 |                        |  scoring functions        |
|  snapshots                |                        |  refresh task             |
|  tags                     |                        |                           |
+---------------------------+                        +---------------------------+
         Shared Kernel (same PostgreSQL database)
```

## 2. Ubiquitous Language

The following terms form the ubiquitous language for the Trend Analytics context. Where the codebase uses different terminology, the mapping is noted.

| Domain Term | Codebase Term | Definition |
|-------------|---------------|------------|
| **Trend delta** | `daily`, `weekly`, `monthly`, `quarterly`, `yearly` columns | The change in star count over a time window. Not just "delta" -- the window matters. NULL means insufficient data; 0 means computed but no change. |
| **Popularity score** | `popularity_score` column | A signed log-scale metric blending star trend deltas across windows. Not "star rating" -- it measures momentum, not absolute count. |
| **Activity score** | `activity_score` column | A 0-100 metric based on recency of last commit and contributor count. Not "freshness" -- it includes a contributor bonus. |
| **Usage score** | `usage_score` column | A 0-100 metric based on monthly npm downloads. Not "downloads" -- it's a normalized log scale. |
| **Relevance score** | `relevance_score` column | A weighted composite of the three dimension scores. Used as a quality floor filter, never as a sort key. |
| **Primary package** | Resolved via `resolvePrimaryPackage()` | The package with highest `monthlyDownloads` for a project. Not "main package" or "first package" -- selection is by download volume, not array order. |
| **Cache refresh** | The daily refresh task | The process of recomputing all scores and upserting cache tables. Not "sync" -- there is no external system being synchronized with. |
| **Eligible project** | `status IN ('active', 'featured', 'promoted')` | A project that participates in cache population. Deprecated and hidden projects are excluded. |
| **Monorepo deduplication** | Pass 1 iterates distinct `repo_id` | The practice of computing repo-level metrics once, regardless of how many projects share that repo. |

**Term conflicts in current code:**
- `repos.stars` is stored as column `stargazers_count` (GitHub API naming) -- the domain says "stars"
- `packages.monthlyDownloads` is stored as column `downloads` -- the domain says "monthly downloads"
- `getPackageData()` in `project-helpers.ts` picks `packages[0]` (first by array order), contradicting the domain concept of "primary package" (highest downloads)

## 3. Aggregates and Aggregate Roots

### Repo Aggregate

**Root:** `repos` entity (`packages/db/src/schema/repos.ts`)

**Contains:**
- Star count (`stargazers_count`)
- Commit metadata (`last_commit`, `commit_count`, `contributor_count`)
- Snapshots (child entities, `packages/db/src/schema/snapshots.ts`) -- star count history stored as JSONB per year with composite PK `(repoId, year)`

**Invariants:**
- A snapshot belongs to exactly one repo (enforced by FK + composite PK)
- `owner` + `name` is unique (enforced by `name_owner_index`)

**Boundary:** The `repo_trends` cache row is NOT part of the Repo aggregate. It is a **projection** -- a derived, read-optimized view maintained by the Trend Analytics context. The Repo aggregate's invariants do not include cached scores. If `repo_trends` is stale or missing, the Repo aggregate is still consistent.

### Project Aggregate

**Root:** `projects` entity (`packages/db/src/schema/projects.ts`)

**Contains:**
- Status, metadata (name, slug, description, URL)
- Reference to repo (by ID only -- `repoId` is a reference, not an embedded entity)
- Packages (child entities, `packages/db/src/schema/packages.ts`) -- npm package records with download data
- Tag associations (via join table `projects_to_tags`)

**Invariants:**
- A project always has exactly one repo reference (`repoId.notNull()`)
- Project name and slug are unique
- Packages belong to exactly one project (FK with CASCADE)

**Boundary:** The `project_trends` cache row is NOT part of the Project aggregate. Same reasoning as above -- it is a projection owned by Trend Analytics.

### Why cache tables are projections, not aggregate members

Cache tables fail the aggregate membership test on three counts:

1. **No invariant coupling.** Deleting or corrupting a `repo_trends` row does not violate any Repo invariant. The repo remains valid. Contrast with snapshots, whose absence would break trend computation (an aggregate-internal concern).

2. **Different lifecycle.** Cache rows are replaced wholesale during each daily refresh. Aggregate members evolve through domain operations (e.g., a new snapshot is created when stars are fetched).

3. **Different ownership.** Cache tables are written by the Trend Analytics context's refresh task, not by the Project Catalog context. An aggregate should be modified only through its own root.

In Evans' terms, cache tables implement the principle: "Whether a balance is computed on-demand or cached is hidden behind the entity interface." Consumers query `project_trends` without knowing scores are pre-computed daily -- the caching is an implementation detail of the read model.

## 4. Value Objects

### TrendDeltas

```typescript
// Produced by computeTrends() in packages/db/src/snapshots/compute-trends.ts
type TrendDeltas = {
  daily: number | undefined;
  weekly: number | undefined;
  monthly: number | undefined;
  quarterly: number | undefined;
  yearly: number | undefined;
};
```

- **Immutable:** Output of a pure computation over snapshot history
- **No identity:** Two TrendDeltas with the same five values are equal
- **Conceptual whole:** All five windows together describe a repo's trending behavior. You would not use `daily` without the context of `monthly` and `yearly`. Evans calls this the "conceptual whole" principle -- the five fields form a coherent unit
- **Mapped to SQL:** `undefined` maps to `NULL` (insufficient data), `0` maps to `0` (computed zero change)

### ScoreSet

```typescript
// Repo-level scores
type RepoScoreSet = {
  popularityScore: number;  // signed, ~-100 to +100
  activityScore: number;    // 0-100
};

// Project-level scores
type ProjectScoreSet = {
  usageScore: number;       // 0-100
  relevanceScore: number;   // signed composite
};
```

- **Immutable:** Snapshot of computed values at refresh time
- **No identity:** Defined entirely by numeric attributes
- **Not persisted as a unit:** Stored as individual columns in cache tables for indexing. This is a pragmatic divergence from pure DDD -- a `ScoreSet` class would add abstraction without benefit at this scale

### PrimaryPackageInfo

```typescript
type PrimaryPackageInfo = {
  name: string;
  monthlyDownloads: number | null;
};
```

- **Immutable:** Extracted from the Package collection at refresh time
- **No identity:** Defined by attributes, not by a primary key
- **Derived value:** Selected by a domain policy (highest downloads), not stored as a first-class entity

## 5. Domain Services

### ScoringService

The four scoring functions are Domain Services -- stateless operations that don't belong to any entity.

| Function | File | Why a Service |
|----------|------|---------------|
| `computePopularityScore(trends)` | `packages/db/src/scores/popularity.ts` | A Repo doesn't "know" its popularity -- scoring is an analytical concern that varies independently of the entity |
| `computeActivityScore(lastCommit, contributors)` | `packages/db/src/scores/activity.ts` | Activity scoring combines repo attributes with a time-dependent formula. The formula is a domain rule, not entity behavior |
| `computeUsageScore(monthlyDownloads)` | `packages/db/src/scores/usage.ts` | Downloads belong to packages, but the score belongs to the analytics context. Cross-entity computation = service |
| `computeRelevanceScore(pop, act, usage, hasPackage)` | `packages/db/src/scores/relevance.ts` | Composites multiple scores with policy-driven weights. A meta-computation over other service outputs |

**Why services, not entity methods:** The scoring formulas are domain rules that vary independently of the entities they score. Changing the popularity formula (e.g., adjusting the blending weights `yearly + monthly*6 + daily*180`) should not require modifying the Repo entity. Evans' guideline: "When a significant process or transformation is not a natural responsibility of an Entity or Value Object, add an operation as a Service."

All four functions are **pure** (no database dependency, no side effects), making them trivially testable via `bun:test`.

### PrimaryPackageResolver

```typescript
// packages/db/src/scores/primary-package.ts
resolvePrimaryPackage(packages: PackageInfo[]): PackageInfo | null
```

- **Stateless selection logic** operating across a collection of packages
- Not a method on Project because the selection rule (max downloads) is a domain policy that could change (see Strategy/Policy section below)
- Not a Repository method because it operates on in-memory data, not persistence

## 6. Strategy/Policy Pattern

Three domain policies are embedded in the phase 1 design. Making them explicit as named concepts improves clarity, even if the current scale does not warrant formal Strategy objects.

### StatusEligibilityPolicy

**Current implementation:** A WHERE clause in the refresh task query.
```sql
WHERE p.status IN ('active', 'featured', 'promoted')
```
See: `packages/db/src/constants.ts` -- `PROJECT_STATUSES`

**DDD insight:** This is a domain policy governing cache population. It answers: "Which projects participate in trend analytics?" Currently a hardcoded predicate, but conceptually it's a Strategy that could be swapped. Example alternative: "include all statuses for admin views" or "include deprecated for historical analysis."

**Pragmatic note:** At bestofjs's scale, extracting this into a formal Policy class would be over-engineering. The WHERE clause IS the policy. Naming it here makes the concept explicit for future discussions.

### RelevanceWeightPolicy

**Current implementation:** Hardcoded weights in `computeRelevanceScore()`.
```typescript
// packages/db/src/scores/relevance.ts
if (hasPackage) {
  return Math.round(pop * 0.5 + act * 0.25 + usage * 0.25);
}
return Math.round(pop * 0.65 + act * 0.35);
```

**DDD insight:** The weight adjustment for no-package projects (0.65/0.35 vs 0.5/0.25/0.25) is a policy embedded in the scoring function. Making it explicit as a named policy would:
- Allow A/B testing different weight schemes
- Make the "no-package adjustment" decision discoverable
- Enable per-category weight overrides in the future

**Pragmatic note:** Extracting weights into a config object is low-cost and worth doing if the weights need tuning. For now, hardcoded constants in a pure function are sufficient -- the function itself is the policy.

### PrimaryPackageSelectionPolicy

**Current implementation:** `resolvePrimaryPackage()` uses `maxBy(monthlyDownloads)`.

**Alternatives this policy could encode:**
- Pick most recently published package
- Pick package whose name matches the project name
- Pick package with most dependents

**DDD insight:** Naming this as a policy makes it clear that "highest downloads" is a deliberate choice, not an accident. The existing `getPackageData()` in `project-helpers.ts` picks `packages[0]` (first by array position) -- that was an implicit policy that happened to be wrong for the cache use case.

## 7. Specifications

### EligibleProjectSpecification

**Predicate:** A project is eligible for cache refresh if `status IN ('active', 'featured', 'promoted')`.

```typescript
// Conceptual specification
class EligibleProjectSpecification {
  isSatisfiedBy(project: { status: string }): boolean {
    return ['active', 'featured', 'promoted'].includes(project.status);
  }
}
```

**Current implementation:** An `inArray()` Drizzle filter in the refresh task query. This is the correct approach -- Evans notes that Specifications mesh with the Repository pattern for efficient filtering by being pushed down to SQL WHERE clauses, not filtered in application code.

**DDD value:** Naming this as a Specification makes the inclusion rule explicit and testable independently of the query that uses it. If the eligibility criteria change (e.g., "include hidden projects for premium users"), the Specification is the single point of change.

### EligibleRepoSpecification

**Predicate:** A repo is eligible if it has at least one eligible project.

**Derived specification:** This is composed from `EligibleProjectSpecification` via an existential quantifier. In SQL:

```sql
SELECT DISTINCT r.id FROM repos r
JOIN projects p ON p."repoId" = r.id
WHERE p.status IN ('active', 'featured', 'promoted')
```

This derived specification is what enables monorepo deduplication in Pass 1 -- it selects distinct repos, not projects, ensuring each repo's trends are computed exactly once regardless of how many sibling projects share it.

**Interaction with Repository pattern:** The specification is pushed down to SQL for efficiency. At ~3K repos, in-memory filtering would work, but the SQL approach scales correctly and is idiomatic for the Drizzle ORM codebase.

## 8. Repositories (DDD sense)

Note: "Repository" here refers to the DDD pattern (illusion of in-memory collection), not git repositories.

### RepoTrendsRepository

**Conceptual interface:**
```typescript
interface RepoTrendsRepository {
  upsert(repoTrend: RepoTrendData): Promise<void>;
  deleteIneligible(): Promise<number>;
  findByRepoId(repoId: string): Promise<RepoTrend | null>;
}
```

**Current implementation:** Direct Drizzle ORM calls in the refresh task.
```typescript
// packages/db/src/schema/repo-trends.ts defines the table
// apps/backend/src/tasks/refresh-cache.task.ts calls:
db.insert(schema.repoTrends).values({...}).onConflictDoUpdate({...});
```

The upsert operation (`INSERT...ON CONFLICT DO UPDATE`) is an implementation detail hidden behind the conceptual repository. Whether scores are computed on-demand or cached is transparent to consumers -- they query `repo_trends` without knowing the refresh schedule.

### ProjectTrendsRepository

Same pattern as RepoTrendsRepository, operating on `project_trends`.

### Should we introduce explicit Repository classes?

**No, not at this scale.** The current "thin" approach -- Drizzle table definitions + direct query calls -- is valid for bestofjs. Evans himself notes that Repositories add value when:
- Multiple consumers need the same query patterns (currently only the refresh task writes, and listing queries will read)
- Complex query construction needs encapsulation
- Testing requires swappable data access

At ~3.5K rows, the direct Drizzle approach provides sufficient encapsulation. The table schema IS the Repository interface. If query patterns proliferate in Phase 2-3 (listing queries, search, filtering), extracting a Repository class becomes worthwhile.

### The caching insight from Evans

Evans writes: "Whether a balance is computed on-demand or cached is hidden behind the entity interface." The cache tables are the implementation of this principle:

- **Before phase 1:** Trends computed on-the-fly per request via `computeTrends(flattenSnapshots())` -- expensive, repeated
- **After phase 1:** Trends pre-computed daily, stored in `repo_trends` and `project_trends` -- fast reads, transparent caching

The consumer (listing page query) sees: "give me projects sorted by popularity." Whether that popularity score was computed 5 minutes or 5 hours ago is an implementation detail.

## 9. Modules

### Current module structure

```
packages/db/src/
  schema/               # Technical grouping: all table definitions
    repos.ts
    projects.ts
    packages.ts
    snapshots.ts
    repo-trends.ts      # NEW: cache table schema
    project-trends.ts   # NEW: cache table schema
    index.ts            # Barrel export
  scores/               # Domain grouping: all scoring logic
    popularity.ts       # computePopularityScore
    activity.ts         # computeActivityScore
    usage.ts            # computeUsageScore
    relevance.ts        # computeRelevanceScore
    primary-package.ts  # resolvePrimaryPackage
    index.ts            # Barrel export
  snapshots/            # Domain grouping: snapshot processing
    compute-trends.ts   # computeTrends
    utils.ts            # flattenSnapshots
  projects/             # Domain grouping: project helpers
    project-helpers.ts

apps/backend/src/
  tasks/
    refresh-cache.task.ts  # NEW: application service
    build-static-api.task.ts
  cli.ts                   # Task registration
```

**Evans alignment:** The `scores/` module follows Evans' advice: "Modules should tell the story of the domain." This module says: "This is where we compute quality signals." The functions inside (`computePopularityScore`, `computeActivityScore`, etc.) are named as activities -- verbs that describe domain operations.

**The `schema/` module** is a technical grouping (horizontal layer) rather than a domain grouping. This is acceptable because schema definitions are inherently technical artifacts. Mixing `repo-trends.ts` with `repos.ts` in the same directory makes sense -- they're both table definitions, and Drizzle Kit needs them in one place for migration generation.

**The refresh task** in `apps/backend/src/tasks/` is correctly placed outside the domain layer. It is an Application Service that orchestrates Domain Services (scoring functions) and Repository operations (upserts). Application Services coordinate but contain no domain logic -- the formulas live in `scores/`, the data access pattern lives in the schema.

## 10. Making Implicit Concepts Explicit

Three concepts are currently implicit in the phase 1 design that Evans would encourage making explicit:

### Refresh Pass

The two-pass structure (repo-first, then project) is a domain process, not just an implementation detail. The ordering matters: project scores depend on repo scores (`relevanceScore` uses `popularityScore` and `activityScore` from the repo).

**Currently implicit:** The two-pass structure exists only in the refresh task's procedural code.

**If made explicit:** A `RefreshProcess` or `CacheRefreshSaga` would formalize the ordering constraint and make the dependency visible. At the current scale, this is unnecessary -- a comment in the task file suffices.

```
Pass 1: Repos (independent)
  snapshot -> TrendDeltas -> PopularityScore + ActivityScore -> repo_trends
                                    |
Pass 2: Projects (depends on Pass 1)                |
  packages -> PrimaryPackage -> UsageScore ---+      |
                                              v      v
                                     RelevanceScore(pop, act, usage)
                                              |
                                              v
                                        project_trends
```

### Score Staleness

The `refreshedAt` timestamp on both cache tables implies a freshness concern. How stale is too stale?

**Currently implicit:** There is no policy for "what happens if the refresh task fails and scores are 48 hours old?"

**If made explicit:** A `StalenessPolicy` would define:
- Maximum acceptable age (e.g., 48 hours)
- Behavior when stale (serve stale data with warning? fall back to on-demand computation?)
- Monitoring alert threshold

**Pragmatic note:** For phase 1, staleness is not a concern -- the daily task runs reliably, and serving yesterday's scores is perfectly acceptable. This concept becomes important if bestofjs scales to real-time score updates.

### Monorepo Boundary

The 1:N `repos`-to-`projects` relationship creates a deduplication need. The concept of "shared repo" is implicit in the data model but not named in the domain.

**Currently implicit:** The `repoId` FK on `projects` implies sharing, but the domain concept -- "these projects are monorepo siblings that share star counts and trend data" -- is never stated.

**If made explicit:** A `MonorepoGroup` concept would formalize:
- Which projects share a repo
- That trend deltas are computed once per group, not per project
- That `repo_trends` is keyed by group (repo_id), not by project_id

**Pragmatic note:** The current design handles this correctly through schema design (`repo_trends` keyed by `repo_id`) and query design (Pass 1 iterates distinct repos). Naming the concept improves communication but adding a formal MonorepoGroup entity would be over-engineering for ~3.5K projects.

## 11. Domain Model Diagram

```
 AGGREGATES                         VALUE OBJECTS              DOMAIN SERVICES
+---------------------------+
|  REPO AGGREGATE           |
|  [Root: repos]            |       +----------------+
|                           |       | TrendDeltas    |        +------------------------+
|  - id (PK)                |       |                |        | ScoringService         |
|  - stars                  |  ---> | daily          |        |                        |
|  - last_commit            |       | weekly         |  <-->  | computePopularityScore |
|  - contributor_count      |       | monthly        |        | computeActivityScore   |
|  - owner, name            |       | quarterly      |        | computeUsageScore      |
|                           |       | yearly         |        | computeRelevanceScore  |
|  Children:                |       +----------------+        +------------------------+
|    snapshots[] (JSONB/yr) |
+---------------------------+       +----------------+        +------------------------+
         |                          | RepoScoreSet   |        | PrimaryPackageResolver |
         | 1:N                      |                |        |                        |
         v                          | popularityScore|        | resolvePrimaryPackage  |
+---------------------------+       | activityScore  |        +------------------------+
|  PROJECT AGGREGATE        |       +----------------+
|  [Root: projects]         |
|                           |       +------------------+
|  - id (PK)                |       | ProjectScoreSet  |
|  - name, slug             |       |                  |
|  - status                 |       | usageScore       |
|  - repoId (ref by ID)     |       | relevanceScore   |
|                           |       +------------------+
|  Children:                |
|    packages[] (0..N)      |       +------------------+      SPECIFICATIONS
|    tags[] (via join)      |       | PrimaryPkgInfo   |
+---------------------------+       |                  |      +---------------------------+
                                    | name             |      | EligibleProjectSpec       |
                                    | monthlyDownloads |      |   status IN (active,      |
                                    +------------------+      |   featured, promoted)     |
                                                              +---------------------------+
                                                              | EligibleRepoSpec          |
 PROJECTIONS (not aggregate members)                          |   has >= 1 eligible proj  |
+---------------------------+                                 +---------------------------+
|  repo_trends              |
|  (keyed by repo_id)       |      POLICIES
|                           |
|  stars, daily..yearly     |      +---------------------------+
|  popularityScore          |      | StatusEligibilityPolicy   |
|  activityScore            |      | RelevanceWeightPolicy     |
|  refreshedAt              |      | PrimaryPkgSelectionPolicy |
+---------------------------+      +---------------------------+

+---------------------------+
|  project_trends           |
|  (keyed by project_id)    |      APPLICATION SERVICE
|                           |
|  packageName              |      +---------------------------+
|  monthlyDownloads         |      | RefreshCacheTask          |
|  usageScore               |      |                           |
|  relevanceScore           |      | Orchestrates:             |
|  refreshedAt              |      |   Pass 1: repo scoring    |
+---------------------------+      |   Pass 2: project scoring |
                                   |                           |
                                   | Uses: ScoringService,     |
                                   |   PrimaryPackageResolver, |
                                   |   EligibleProjectSpec,    |
                                   |   computeTrends()         |
                                   +---------------------------+
```

**Data flow during cache refresh:**

```
1. EligibleRepoSpec selects distinct repos
2. For each repo:
   snapshots -> flattenSnapshots() -> computeTrends() -> TrendDeltas
   TrendDeltas -> computePopularityScore() -> popularityScore
   (repo.last_commit, repo.contributor_count) -> computeActivityScore() -> activityScore
   UPSERT into repo_trends

3. EligibleProjectSpec selects projects
4. For each project:
   project.packages -> resolvePrimaryPackage() -> PrimaryPackageInfo
   PrimaryPackageInfo.monthlyDownloads -> computeUsageScore() -> usageScore
   (popularityScore, activityScore, usageScore, hasPackage) -> computeRelevanceScore() -> relevanceScore
   UPSERT into project_trends
```

## Pragmatic Assessment: Where DDD Adds Value vs Over-Engineering

At bestofjs's scale (~3,500 projects, ~3,000 repos, single daily refresh), not every DDD pattern warrants full implementation. Here is an honest assessment:

### Worth the investment

| Concept | Why |
|---------|-----|
| **Aggregate boundaries** (Repo vs Project, cache as projection) | Prevents the mistake of treating cache tables as part of the core domain model. Keeps the source-of-truth clear. |
| **Domain Services** (pure scoring functions) | Already implemented this way. Pure functions in `scores/` are testable, composable, and independently deployable. |
| **Ubiquitous Language** | Prevents confusion between "primary package" (highest downloads) and "first package" (array[0]). The `getPackageData()` bug proves this matters. |
| **Specifications** (eligibility predicates) | Naming the inclusion rule makes it a deliberate design choice rather than an ad-hoc WHERE clause. |
| **Value Objects** (TrendDeltas) | The NULL vs 0 distinction is critical for correct sorting. Naming TrendDeltas as a coherent unit makes this invariant explicit. |

### Not worth formalizing (at current scale)

| Concept | Why skip |
|---------|----------|
| **Formal Repository classes** | Direct Drizzle calls are sufficient. The table schema serves as the interface. Extract if query patterns proliferate in Phase 2-3. |
| **Explicit Policy objects** | Hardcoded weights and status lists are readable and greppable. Extract if A/B testing or per-category customization is needed. |
| **RefreshProcess/Saga** | The two-pass dependency is adequately captured by sequential code + a comment. A formal process object would add indirection without benefit. |
| **Anti-corruption layer** | Both contexts share a database and are maintained by the same team. A translation layer would add complexity without isolation benefit. |
| **MonorepoGroup entity** | Schema design (repo_id PK on repo_trends) handles dedup correctly. Naming the concept in documentation (as done above) is sufficient. |

The guiding principle: **name the concepts, implement the patterns that prevent bugs, defer the patterns that add abstraction without preventing bugs.**

---

*Document created: 2026-04-09*
*Phase: 01-cache-foundation (pre-implementation DDD analysis)*
*References: Evans (2003) Domain-Driven Design, phase 1 plans (01-01 through 01-03), CONTEXT.md, RESEARCH.md*
