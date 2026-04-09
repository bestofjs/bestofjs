---
phase: quick-02
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - .planning/quick/2-ddd-designs-for-phase-1-cache-foundation/DDD-DESIGN.md
autonomous: true
requirements: [CACHE-01, CACHE-02, CACHE-03, CACHE-04, CACHE-05, SCORE-01, SCORE-02, SCORE-03, SCORE-04, DATA-01, DATA-03]

must_haves:
  truths:
    - "DDD design document maps every major Evans concept (Bounded Contexts, Aggregates, Value Objects, Domain Services, Repositories, Modules, Specifications, Strategy/Policy) to concrete bestofjs phase 1 elements"
    - "Document identifies which phase 1 artifacts are Entities vs Value Objects vs Domain Services and explains WHY"
    - "Document shows how the cache tables fit into DDD as an implementation detail hidden behind Repository interfaces"
  artifacts:
    - path: ".planning/quick/2-ddd-designs-for-phase-1-cache-foundation/DDD-DESIGN.md"
      provides: "DDD design mapping for phase 1 cache foundation"
      min_lines: 150
  key_links: []
---

<objective>
Create a DDD design document that maps Eric Evans' domain-driven design concepts onto the bestofjs phase 1 cache foundation work.

Purpose: Provide a strategic design lens for the cache foundation implementation, making domain concepts explicit and identifying where DDD patterns add clarity to the existing plans.
Output: A single DDD-DESIGN.md document in the quick task directory.
</objective>

<execution_context>
@/home/ubuwarudo/.claude/get-shit-done/workflows/execute-plan.md
@/home/ubuwarudo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-cache-foundation/01-CONTEXT.md
@.planning/phases/01-cache-foundation/01-RESEARCH.md
@.planning/phases/01-cache-foundation/01-01-PLAN.md
@.planning/phases/01-cache-foundation/01-02-PLAN.md
@.planning/phases/01-cache-foundation/01-03-PLAN.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create DDD design document mapping Evans concepts to phase 1 cache foundation</name>
  <files>.planning/quick/2-ddd-designs-for-phase-1-cache-foundation/DDD-DESIGN.md</files>
  <action>
Create a comprehensive DDD design document. Read the phase 1 plans (01-01, 01-02, 01-03), CONTEXT.md, and RESEARCH.md to understand all domain entities, scoring functions, cache tables, and the refresh task. Also read the existing codebase schema files to understand current domain modeling.

Key files to read for domain understanding:
- `packages/db/src/schema/repos.ts` -- Repo entity
- `packages/db/src/schema/projects.ts` -- Project entity
- `packages/db/src/schema/packages.ts` -- Package entity
- `packages/db/src/schema/snapshots.ts` -- Snapshot entity
- `packages/db/src/snapshots/compute-trends.ts` -- existing trend computation
- `packages/db/src/projects/project-helpers.ts` -- existing helpers
- `packages/db/src/constants.ts` -- PROJECT_STATUSES

The document MUST cover these sections:

**1. Bounded Contexts**
- Identify the bounded contexts in play: "Project Catalog" (existing core), "Trend Analytics" (new in phase 1), and their relationship
- Map the context boundary: what belongs to Trend Analytics vs what it borrows from Project Catalog
- Note that both contexts share the same database (shared kernel pattern) but have distinct models

**2. Ubiquitous Language**
- Define key terms as used in the bestofjs domain: "trend delta" (not just "delta"), "popularity score" (not "star rating"), "primary package" (not "main package"), "cache refresh" (not "sync"), "monorepo deduplication"
- Call out where current code uses different terms than the domain (e.g., `stargazers_count` vs `stars`)

**3. Aggregates and Aggregate Roots**
- **Repo Aggregate**: Root = Repo entity. Contains: star count, last_commit, contributor_count, snapshots (child entities). Invariant: snapshots belong to exactly one repo. The repo_trends cache row is a PROJECTION of this aggregate, not part of it.
- **Project Aggregate**: Root = Project entity. Contains: status, link to repo (reference by ID only, not embedded), packages (child entities). Invariant: a project always has exactly one repo reference. The project_trends cache row is a PROJECTION of this aggregate.
- Explain WHY cache tables are projections, not aggregate members: they are derived read-optimized views, not sources of truth. The aggregate's invariants don't include cached scores.

**4. Value Objects**
- **TrendDeltas**: { daily, weekly, monthly, quarterly, yearly } -- immutable, no identity, defined entirely by its five numeric attributes. Produced by `computeTrends()`.
- **ScoreSet**: { popularityScore, activityScore } for repos; { usageScore, relevanceScore } for projects -- immutable snapshots of computed values. No identity.
- **PrimaryPackageInfo**: { name, monthlyDownloads } -- a Value Object extracted from the Package collection. Defined by attributes, not identity.
- Explain the conceptual whole principle: TrendDeltas forms a coherent unit (all five windows together describe a repo's trending behavior)

**5. Domain Services**
- **ScoringService** (the four pure scoring functions): Stateless operations that don't belong to any entity. A Repo doesn't "know" its popularity score -- scoring is a cross-cutting analytical concern. Named as activities: `computePopularityScore`, `computeActivityScore`, `computeUsageScore`, `computeRelevanceScore`.
- **PrimaryPackageResolver** (`resolvePrimaryPackage`): Stateless selection logic that operates across a collection of packages. Not a method on Project because the selection rule (max downloads) is a domain policy that could change.
- Explain WHY these are services not entity methods: the scoring formulas are domain rules that vary independently of the entities they score

**6. Strategy/Policy Pattern**
- **StatusEligibilityPolicy**: The rule "include active/featured/promoted, exclude deprecated" is a domain policy that governs cache population. Currently implemented as a WHERE clause, but conceptually it's a Strategy that could be swapped (e.g., "include all statuses for admin views").
- **RelevanceWeightPolicy**: The weight adjustment for no-package projects (0.5/0.25/0.25 vs 0.65/0.35) is a policy embedded in the relevance scoring function. Making it explicit as a policy object would allow A/B testing different weight schemes.
- **PrimaryPackageSelectionPolicy**: "Pick highest monthly downloads" is a policy. Alternative: "pick most recently published" or "pick by name match to project". Currently a simple function, but DDD names it as a separable concern.

**7. Specifications**
- **EligibleProjectSpecification**: Predicate that determines if a project participates in cache refresh. Currently: `status IN ('active', 'featured', 'promoted')`. This is a classic DDD Specification used for selection/querying.
- **EligibleRepoSpecification**: Derived specification -- a repo is eligible if it has at least one eligible project. Used for monorepo deduplication in Pass 1.
- Note how these specifications mesh with the Repository pattern for efficient filtering (pushed down to SQL WHERE clauses, not filtered in application code)

**8. Repositories (DDD sense, not git)**
- **RepoTrendsRepository**: Encapsulates the read/write of repo_trends table. Provides "illusion of in-memory collection." The upsert operation is an implementation detail. Could return summary calculations (e.g., score distributions) without exposing the table.
- **ProjectTrendsRepository**: Same for project_trends.
- Note: The existing codebase uses Drizzle ORM directly (no Repository abstraction layer). The DDD Repository concept maps to the table + upsert pattern even without an explicit Repository class. Whether to introduce a Repository class is an architectural choice -- the current "thin" approach is valid for this scale.
- Explain the caching insight from Evans: "whether a balance is computed on-demand or cached is hidden behind the entity interface." The cache tables ARE the implementation of this principle -- consumers query project_trends without knowing scores are pre-computed daily.

**9. Modules**
- Current phase 1 module structure: `packages/db/src/scores/` groups all scoring by domain concept (not by pattern). This follows Evans' advice: "tell the story of the domain" -- the scores module says "this is where we compute quality signals."
- `packages/db/src/schema/` groups all table definitions. This is a technical grouping (horizontal layer) but acceptable because schemas are inherently technical.
- The refresh task in `apps/backend/src/tasks/` is an application service that orchestrates domain services -- it lives outside the domain layer, which is correct.

**10. Making Implicit Concepts Explicit**
- Identify concepts currently implicit in the phase 1 design that could be made explicit:
  - "Refresh Pass" -- the two-pass structure (repo-first, then project) is a domain process, not just an implementation detail. The ordering matters because project scores depend on repo scores.
  - "Score Staleness" -- the `refreshedAt` timestamp implies a freshness concern. How stale is too stale? This is currently implicit.
  - "Monorepo Boundary" -- the 1:N repos-to-projects relationship creates a deduplication need. The concept of "shared repo" is implicit in the data model but not named in the domain.

**11. Diagram: Domain Model**
- Include a text-based diagram (using ASCII/markdown) showing:
  - Aggregates with their boundaries
  - Value Objects produced by Domain Services
  - How cache tables relate as projections
  - The refresh task as an Application Service orchestrating the flow

Format the document with clear markdown headers, code examples referencing actual file paths from the plans, and explicit callouts where the current implementation aligns with or diverges from pure DDD (pragmatic notes about when full DDD abstraction would be over-engineering at bestofjs's scale of ~3.5K projects).
  </action>
  <verify>
    <automated>wc -l .planning/quick/2-ddd-designs-for-phase-1-cache-foundation/DDD-DESIGN.md && grep -c "^##" .planning/quick/2-ddd-designs-for-phase-1-cache-foundation/DDD-DESIGN.md</automated>
  </verify>
  <done>DDD design document exists with 150+ lines, covers all 11 sections, maps every major Evans concept to concrete bestofjs phase 1 elements with file path references, and includes pragmatic notes about where full DDD would be over-engineering.</done>
</task>

</tasks>

<verification>
- Document exists at `.planning/quick/2-ddd-designs-for-phase-1-cache-foundation/DDD-DESIGN.md`
- Document covers all 11 sections (Bounded Contexts through Making Implicit Concepts Explicit)
- Each section references concrete bestofjs file paths and phase 1 plan elements
- Document distinguishes between DDD concepts that add value at this scale vs those that would be over-engineering
</verification>

<success_criteria>
- Every major Evans DDD concept from the user's NotebookLM research is mapped to a specific phase 1 element
- Aggregate boundaries clearly drawn around Repo and Project with cache tables as projections
- Scoring functions correctly classified as Domain Services with rationale
- Status filtering identified as a Specification pattern
- Weight schemes identified as Strategy/Policy patterns
- Pragmatic tone: acknowledges where bestofjs's scale makes full DDD abstraction unnecessary
</success_criteria>

<output>
After completion, create `.planning/quick/2-ddd-designs-for-phase-1-cache-foundation/2-01-SUMMARY.md`
</output>
