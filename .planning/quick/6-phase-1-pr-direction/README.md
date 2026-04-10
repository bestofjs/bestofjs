# Phase 1 — Cache Foundation — PR Direction

Reviewer-facing document set for the Phase 1 pull request.
**Goal of Phase 1:** introduce a denormalized, daily-refreshed cache layer (`repo_trends`, `project_trends`) and a pure scoring module so later phases can replace the mingo-on-static-JSON read path with real Drizzle queries.

## Reading order

| # | Document | Purpose |
|---|---|---|
| 1 | [OVERVIEW.md](./OVERVIEW.md) | Current domains & modules, what's being added, plan-step mapping |
| 2 | [ARCHITECTURE-CURRENT.md](./ARCHITECTURE-CURRENT.md) | Mermaid diagrams of the system **before** Phase 1 |
| 3 | [ARCHITECTURE-AFTER.md](./ARCHITECTURE-AFTER.md) | Mermaid diagrams of the system **after** Phase 1 |
| 4 | [CONCEPTS.md](./CONCEPTS.md) | Ubiquitous language: existing terms + new terms + three DDD refinements |

## Scope boundary

Phase 1 lands the cache **write path** only. No web-app changes, no new read path. The cache tables exist and are populated daily, but no consumer queries them yet. That is Phase 2+.

## Source docs this summarises

- `.planning/quick/2-ddd-designs-for-phase-1-cache-foundation/DDD-DESIGN.md`
- `.planning/quick/3-module-boundary-design-for-phase-1-cache/MODULE-BOUNDARIES.md`
- `.planning/research/ARCHITECTURE.md`
- `.planning/phases/01-cache-foundation/01-01-PLAN.md` … `01-04-PLAN.md`

## Codebase-reality source

Concept mapping was cross-checked with [ontomics](https://github.com/…) against the repo as of branch `issue-371-static-api-to-database-queries`, and refined against Evans, *Domain-Driven Design* (2003) via NotebookLM. Three material corrections to the DDD design doc are captured in [CONCEPTS.md §3](./CONCEPTS.md#3-refinements-from-evans).
