# Concepts — Ubiquitous Language for Phase 1

This is the ubiquitous language for the cache-foundation phase. It is cross-checked against the codebase via ontomics and refined against Evans's *Domain-Driven Design* (2003) via NotebookLM.

## 1. Terms that already exist in the code

These terms are already in the codebase. Phase 1 does not change them, but reviewers should recognise them in the diffs.

| Term | Canonical location | Meaning |
|---|---|---|
| **Project** | `packages/db/src/schema/projects.ts`, `packages/db/src/projects/` | Aggregate root. Has `status`, `slug`, `repoId`, and many `is*` predicates scattered across admin/web |
| **Repo** | `packages/db/src/schema/repos.ts`, `packages/api/src/github/` | Aggregate root. `owner + name` unique. `stargazers_count` (GitHub API naming) is what the domain calls "stars" |
| **Snapshot** | `packages/db/src/schema/snapshots.ts`, `packages/db/src/snapshots/` | Child of Repo aggregate. Composite PK `(repoId, year)`. `months` is JSONB. Star-count history |
| **Package** | `packages/db/src/schema/packages.ts`, `packages/db/src/projects/packages.ts` | Child of Project aggregate. `monthlyDownloads` stored in column `downloads` (naming mismatch) |
| **Tag** | `packages/db/src/schema/tags.ts`, `packages/db/src/tags/` | Category taxonomy. Joined to projects via `projects_to_tags` |
| **Trend deltas** (informal) | `packages/db/src/snapshots/compute-trends.ts:9` | `computeTrends()` already produces `{daily, weekly, monthly, quarterly, yearly}`. Phase 1 formalises this as the `TrendDeltas` value object |
| **Status** (eligibility) | `packages/db/src/constants.ts` → `PROJECT_STATUSES` | `active`, `featured`, `promoted`, `deprecated`, `hidden` |
| **Implicit eligibility predicates** | `apps/backend/src/tasks/build-static-api.task.ts` | `isColdProject`, `isPopularPackage`, `isInactiveProject`, `isPromotedProject`, `isFeaturedProject`, `shouldIncludeProjectInMainList`. Phase 1 supersedes these (for the cache path) with one named `EligibleProjectSpecification` |
| **`flattenSnapshots`** | `packages/db/src/projects/project-helpers.ts:42` | Reused by the refresh task |
| **`getPackageData`** (BUG) | `packages/db/src/projects/project-helpers.ts:71` | Returns `packages[0]` — first by array order, not max downloads. Phase 1 introduces `resolvePrimaryPackage` as the correct replacement. `getPackageData` stays until Phase 2 |
| **`relevanceScore`** ⚠ | `packages/db/src/projects/find.ts:168` | **EXISTING meaning: text-search rank via CASE expression.** This collides with the new Trend Analytics meaning — see §3.2 |

## 2. Terms introduced by Phase 1

### 2.1 Schema-level (Plan 01-01)

| Term | Type | Where | Definition |
|---|---|---|---|
| **`repo_trends`** | Table | `schema/repo-trends.ts` | Derived, denormalized per-repo row with stars, 5 trend deltas, `popularityScore`, `activityScore`, `refreshedAt`. Keyed by `repo_id` (monorepo dedup). FK CASCADE |
| **`project_trends`** | Table | `schema/project-trends.ts` | Derived, denormalized per-project row with primary package name, monthly downloads, `usageScore`, `relevanceScore`, `refreshedAt`. Keyed by `project_id`. FK CASCADE |
| **TrendDeltas** | Value Object | Structural type in `scores/popularity.ts` | `{daily, weekly, monthly, quarterly, yearly}`, each `number \| undefined`. `undefined` = insufficient data (maps to SQL NULL). `0` = computed zero change. This distinction is critical for correct ORDER BY |
| **ScoreSet** (conceptual) | Value Object | Not a class; individual columns in cache tables | Immutable bundle of score values. Stored as columns for indexing |
| **PrimaryPackageInfo** | Value Object | Structural type in `scores/primary-package.ts` | `{name: string, monthlyDownloads: number \| null}`. Selected by max downloads |

### 2.2 Scoring (Plan 01-02)

| Term | Where | Definition |
|---|---|---|
| **`computePopularityScore(TrendDeltas)`** | `scores/popularity.ts` | Signed log-scale metric blending star deltas across windows. Measures **momentum**, not absolute star count |
| **`computeActivityScore(lastCommit, contributorCount)`** | `scores/activity.ts` | 0–100 metric from commit recency and contributor count. Includes a contributor bonus — not pure "freshness" |
| **`computeUsageScore(monthlyDownloads)`** | `scores/usage.ts` | 0–100 metric from log-normalised monthly npm downloads |
| **`computeRelevanceScore(pop, act, usage, hasPackage)`** ⚠ | `scores/relevance.ts` | Composite **quality floor** — weighted combination of the three dimension scores. **Quality floor only, never a sort key.** Name collides with existing text-search `relevanceScore` in `find.ts` — see §3.2 |
| **`resolvePrimaryPackage(packages)`** | `scores/primary-package.ts` | Selects package by **max `monthlyDownloads`**, not array order. The correct replacement for `getPackageData` |
| **Cache refresh** | `refresh-cache.task.ts` | The daily process of recomputing all scores and upserting cache tables. Not "sync" — there is no external system being synchronised with |

### 2.3 Specifications and policies (Plan 01-03)

| Term | Implementation | Supersedes |
|---|---|---|
| **`EligibleProjectSpecification`** | Drizzle `inArray(projects.status, ['active','featured','promoted'])` in `refresh-cache.task.ts` | Ad-hoc `shouldIncludeProjectInMainList` + sibling `is*` predicates in `build-static-api.task.ts` |
| **`EligibleRepoSpecification`** | `SELECT DISTINCT r.id FROM repos JOIN projects WHERE status IN (…)` | Implicit — never named before |
| **`PrimaryPackageSelectionPolicy`** | `argmax(monthlyDownloads)` inside `resolvePrimaryPackage` | `getPackageData` `packages[0]` bug |
| **`RelevanceWeightPolicy`** | Hardcoded weights in `computeRelevanceScore` (`0.5/0.25/0.25` vs `0.65/0.35`) | New |
| **`StatusEligibilityPolicy`** | Same WHERE clause as `EligibleProjectSpecification` — one is the spec, the other is its policy framing | Conceptual naming only |
| **Monorepo deduplication** | Pass 1 iterates distinct `repo_id` | Previously implicit in schema design |

### 2.4 Application service (Plan 01-03)

| Term | Implementation |
|---|---|
| **`RefreshCacheTask`** | `apps/backend/src/tasks/refresh-cache.task.ts`. Application Service — orchestrates the cohesive mechanism (`scores/`), the specifications (eligibility), and the repository operations (upserts). Contains **no domain logic itself**. Two passes: repos first (independent), projects second (depend on repo scores) |

---

## 3. Refinements from Evans

Three corrections to the DDD-DESIGN.md doc surfaced when cross-checking with Evans's actual text. All three keep the *design* as-is and only change *vocabulary or classification*.

> **Status:**
>
> - ✅ **Applied** — `.planning/quick/2-ddd-designs-for-phase-1-cache-foundation/DDD-DESIGN.md` — §§1, 2, 3, 5, 9, 11 updated
> - ✅ **Applied** — `.planning/quick/3-module-boundary-design-for-phase-1-cache/MODULE-BOUNDARIES.md` — §1.3, §1.4 updated
> - 🕓 **Deferred to Phase 2** — the `relevanceScore` rename in `packages/db/src/projects/find.ts:168`. Phase 1 is purely additive (new schema + new scores/ module + new refresh task); it never modifies `find.ts`. The collision is documented here and in DDD-DESIGN.md §2 as a known false cognate, to be resolved when Phase 2 wires the listing query module.

### 3.1 Cache tables are "denormalised, derived data", NOT "projections"

**DDD-DESIGN.md §3 calls cache tables "projections".**
Evans doesn't use the term "projection" or "read model" in the 2003 book — those are CQRS-era vocabulary. Evans's own terms for this pattern are:

- **Denormalisation** — "storing multiple copies of the same data… when access time is more critical than storage space or simplicity of maintenance"
- **Derived data/attributes** — values calculated from other data

**Why it matters:** using non-Evans vocabulary in a DDD doc costs credibility and hides the actual pattern. The *reasoning* for why cache tables are not aggregate members (different lifecycle, no invariant coupling, different ownership) is all correct — just update the label.

**Action:** in DDD-DESIGN.md §1, §3, §11, swap "projection" → "denormalised, derived data". Keep Evans's quote from §8: *"Whether a balance is computed on-demand or cached is hidden behind the entity interface."*

✅ **Applied.** DDD-DESIGN.md §1 context-relationship paragraph, §3 aggregate-boundary paragraphs and "Why cache tables are derived data, not aggregate members" heading, and §11 ASCII diagram `DERIVED DATA (not aggregate members)` label all updated.

### 3.2 `relevanceScore` is a false cognate

**DDD-DESIGN.md §2 introduces `relevance_score` as the composite quality floor.**
Ontomics shows `packages/db/src/projects/find.ts:168` already uses `relevanceScore` as a local variable for a **text-search CASE-expression rank**. That is a different concept in a different context.

Evans has a named pattern for exactly this: **false cognate** — two teams using the same term with different meanings, which causes "weird contradictions" in databases and team confusion. His guidance for resolving this **inside a Shared Kernel**:

1. Consultation before changing the kernel is mandatory.
2. Iron out the language — "form a joint group… work out a shared model… identify synonyms and map terms."
3. **Either break through to a deeper model** that supersedes both definitions, **or defer merging** into the Shared Kernel and keep the terms in separate contexts.
4. Do NOT silently overload the term.

**Action — pick one before Plan 01-02 lands:**

**Option A — rename the existing one (lightest):**
- Rename the local variable in `find.ts:168` → `nameMatchRank` or `textMatchRank`.
- Update DDD-DESIGN.md §2 unchanged.
- Pros: the existing usage is a *local `const` in a CASE expression*, no exported symbol. One-file change.

**Option B — rename the new one:**
- Call the new Trend Analytics column `quality_score` instead of `relevance_score`.
- Update DDD-DESIGN.md §2 and Plan 01-01 schemas.
- Pros: frees the existing `find.ts` usage.
- Cons: "quality floor" and "quality score" are subtly different; reviewers may conflate.

**Recommendation:** Option A. The existing `find.ts` symbol is trivially renamed, and the new domain concept is more prominent going forward.

🕓 **Deferred to Phase 2.** Phase 1 is purely additive in `packages/db` (new schema files + new `scores/` leaf module + new refresh task in the backend app). It never touches `packages/db/src/projects/find.ts`. Pre-applying the rename here would be scope creep. The collision is *documented* in DDD-DESIGN.md §2 as a known false cognate and flagged in the Phase 2 plan so it gets resolved atomically with the listing-query work that actually reads from the `project_trends.relevance_score` column.

### 3.3 Scoring functions are NOT Domain Services — they are a Cohesive Mechanism

**DDD-DESIGN.md §5 labels `computePopularityScore` etc. as "Domain Services".**
Evans is explicit: *"Parameters and results [of a Domain Service] should be domain objects."* The scoring functions take primitives (`number`, `Date | null`) and return primitives. That is a mismatch with Evans's Domain Service definition.

Evans's two alternatives for pure algorithmic logic:

| Pattern | When it fits | Phase 1 fit |
|---|---|---|
| **Value Object with Side-Effect-Free Functions** | The computation lives on an immutable Value Object as a method — e.g., `trendDeltas.toPopularityScore()` | Workable but forces wrapping primitives in Value Objects just to host the function |
| **Cohesive Mechanism** | A sticky computational problem factored out so the domain stays focused on "the what" not "the how"; doesn't represent the domain itself | **Best fit.** The scoring formulas are algorithmic mechanics the domain relies on, not domain expression |

Evans: *"A Cohesive Mechanism does not represent the domain; rather, it solves the complex computational problem… so that the core domain objects can remain focused on expressing the problem."*

This framing is actually a **stronger** justification for MODULE-BOUNDARIES.md §4's rule that `scores/` is a leaf with zero project imports. A Cohesive Mechanism is *meant* to be isolated from domain objects.

**Action:** in DDD-DESIGN.md §5, reframe `packages/db/src/scores/` as a **Cohesive Mechanism**, not a Domain Service. The implementation plans don't change — only the label and the one-paragraph rationale.

✅ **Applied.** DDD-DESIGN.md §5 retitled `## 5. Cohesive Mechanism (not Domain Services)`, rationale rewritten with Evans's "parameters should be domain objects" criterion, §9 refresh-task paragraph and §11 diagram column header updated to match. MODULE-BOUNDARIES.md §1.3 renamed `Scoring Cohesive Mechanism` and §1.4 refresh-task responsibility updated.

---

## 4. Quick reference

```
AGGREGATES (Project Catalog context)          DERIVED DATA (Trend Analytics)
  Repo (root)                                   repo_trends     ← denormalised
    └─ Snapshot                                 project_trends  ← denormalised
  Project (root)
    ├─ Package                                COHESIVE MECHANISM
    └─ Tag (via ProjectsToTags)                 scores/  (pure, leaf, no deps)
                                                  computePopularityScore
VALUE OBJECTS                                     computeActivityScore
  TrendDeltas {daily..yearly}                     computeUsageScore
  RepoScoreSet                                    computeRelevanceScore ⚠
  ProjectScoreSet                                 resolvePrimaryPackage
  PrimaryPackageInfo
                                                SPECIFICATIONS
POLICIES (named, not extracted)                   EligibleProjectSpec
  RelevanceWeightPolicy                             status ∈ {active,featured,promoted}
  PrimaryPackageSelectionPolicy                   EligibleRepoSpec
  StatusEligibilityPolicy                           repo has ≥1 eligible project

APPLICATION SERVICE
  refresh-cache.task.ts (Pass 1 repos → Pass 2 projects)
```

Status: §3.1 and §3.3 applied; §3.2 (`relevanceScore` rename) documented but deferred to Phase 2 — see §3 status block.
