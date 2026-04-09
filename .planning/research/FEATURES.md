# Feature Research

**Domain:** DB-backed project listing/ranking pages for open-source catalog (Best of JS)
**Researched:** 2026-04-09
**Confidence:** HIGH (based on existing codebase analysis and domain knowledge)

## Feature Landscape

### Table Stakes (Users Expect These)

These are features the current static JSON system already provides. The DB migration must reproduce every one of them or users will notice regressions.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Sort by total stars | Primary ranking signal for OSS projects; default sort on `/projects` | LOW | Direct `ORDER BY popularity_score DESC` on `project_trends` |
| Sort by star trends (daily, weekly, monthly, yearly) | Core differentiator of Best of JS; the "trending" concept | MEDIUM | Requires `repo_trends` cache with pre-computed deltas at 4 time windows |
| Sort by monthly downloads | npm usage is the other axis of project relevance | LOW | `ORDER BY usage_score DESC` from `project_trends` |
| Sort by last commit date | Signals project health/activity | LOW | Already on `repos.pushed_at`, join to project |
| Sort by contributor count | Community health signal | LOW | Already on `repos.contributor_count` |
| Sort by creation date (oldest first) | Niche but expected for historical browsing | LOW | `repos.created_at ASC` |
| Sort by date added to Best of JS (newest) | Discovery of newly curated projects | LOW | `projects.added_at DESC` |
| Multi-tag filtering ($all semantics) | Users combine tags like "react + state-management" to narrow results | MEDIUM | DB subquery: `WHERE project_id IN (SELECT ... GROUP BY ... HAVING COUNT = N)` |
| Text search (project name, description) | Search palette's "Search for..." path triggers server-side search | MEDIUM | ILIKE on `projects.name` and `projects.description`; pg_trgm deferred |
| Pagination (skip/limit with page controls) | Standard for any list beyond ~30 items | LOW | `LIMIT/OFFSET` with total count |
| Relevant tags (tag suggestions based on current results) | Helps users drill down; shown below selected tags | MEDIUM | Aggregate tags from result set, exclude already-selected, rank by frequency |
| Selected tag display with remove buttons | Users need to see and modify their active filters | LOW | Pure UI concern, same as today |
| Total result count display | "1,234 projects" in header; users orient by count | LOW | `COUNT(*)` from the same query |
| Project card: logo, name, description, tags, GitHub/homepage links | The list item itself; core content display | LOW | Same component, just different data source |
| Project card: contextual metric (stars, delta, downloads) based on sort | Right-side score changes meaning with sort option | LOW | Render-time: pick field from `project_trends` based on active sort |
| Home page: hot projects (top 5 by daily/weekly/monthly trends) | Landing page hero content; first thing users see | LOW | `ORDER BY activity_score DESC LIMIT 5` or specific trend column |
| Home page: newest projects (top 5 by added_at) | Discovery section on landing | LOW | `ORDER BY added_at DESC LIMIT 5` |
| Home page: featured projects (daily rotation) | Curated editorial picks; uses `daily_featured_projects` table | LOW | Already DB-backed (`daily_featured_projects`), just needs project data from DB instead of static JSON |
| Home page: popular tags (top 10 by project count) | Navigation aid on landing | LOW | Already DB-backed via `findTagsWithProjects` |
| Tags page: browsable tag list with project counts | `/tags` with sort/filter/pagination | LOW | Already migrated to DB (`findTagsWithProjects`) |
| Monthly rankings page | `/rankings/monthly/[year]/[month]` | LOW | Already fetched from external rankings JSON; just needs project enrichment from DB |
| Status-based exclusion (deprecated projects hidden) | Users should never see deprecated projects in listings | LOW | `WHERE status != 'deprecated'` in all list queries |
| OG image generation for project lists | Social sharing of filtered views | LOW | Same data, different source |

### Differentiators (Competitive Advantage)

Features the DB migration enables that were not possible or practical with static JSON.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Multi-dimensional scoring (popularity, activity, usage) | Separate sort axes let users choose what "best" means to them; static JSON only had raw values | MEDIUM | Four scoring functions computed in `repo_trends` + `project_trends` cache tables |
| Relevance-based quality floor | `relevance_score` in WHERE clause filters low-quality noise without hiding everything; replaces binary `shouldIncludeProjectInMainList()` | LOW | Single composite score, threshold in WHERE, never ORDER BY |
| UI labels from score thresholds (trending, hot, cold, frozen) | Visual badges that help users scan lists faster; impossible with static data unless pre-computed | LOW | Render-time derivation from score values; no DB change needed |
| Scalability beyond ~2k active projects | Static JSON caps at memory limits; DB handles 10k+ trivially | LOW | Architectural win from the migration itself |
| Metadata edits without full rebuild | Admins can fix a project name/tag and see it reflected on next page load | LOW | DB writes are immediate; no need to rebuild static API |
| Server-side search with ranking | Current search is client-side (preloaded index) for the palette, but "Search for..." falls back to server; DB enables proper ranked search | MEDIUM | ILIKE first, pg_trgm upgrade path for fuzzy matching later |
| Composite sort stability | DB `ORDER BY score DESC, stars DESC` gives deterministic ordering; mingo sort on computed fields could have inconsistencies | LOW | Natural benefit of SQL |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Real-time star counts | "I want to see stars update live" | GitHub API rate limits make real-time impossible; 24h batch is the ceiling; chasing real-time creates fragile polling infrastructure | Keep daily refresh cycle; document "updated every 24h" clearly |
| User-defined custom sort expressions | "Let me sort by stars * downloads / age" | Arbitrary expressions on DB are a SQL injection vector and performance hazard; also confusing UX | Provide the 4 pre-computed scores as sort options; they cover 95% of use cases |
| Full-text search with stemming/synonyms | "Search should understand 'state management' matches 'store'" | pg_trgm + full-text search adds schema complexity, index maintenance, and tuning burden for ~3.5k rows where ILIKE is sub-millisecond | Start with ILIKE; add pg_trgm only if users report missing results at scale |
| Faceted search (multiple filter dimensions simultaneously) | "Filter by stars > 1000 AND downloads > 10k AND language = TypeScript" | Exponential UI complexity; requires range slider components, language taxonomy, numeric input validation; not what a curated catalog needs | Tags cover categorical filtering; sort options cover numeric ranking; keep it simple |
| Cold/frozen project exclusion from listings | "Hide inactive projects from results" | Premature filtering loses useful historical data; a project with 50k stars and no commits in 2 years is still valuable | Ranking handles visibility: cold projects sink to the bottom via `activity_score`, but remain findable |
| Infinite scroll instead of pagination | "Don't make me click next page" | Breaks shareable URLs (which page am I on?), makes browser back-button unreliable, harder to implement accessible keyboard navigation | Keep pagination with page numbers in URL params; proven pattern for this type of catalog |
| Bookmark/favorite sort option in DB queries | "Sort by my bookmarks" | Bookmarks are per-user client state; mixing user-specific data into server queries requires auth, sessions, per-user DB rows | Keep bookmark sort client-side only (already excluded from DB migration scope) |
| GraphQL API for listings | "Let consumers query exactly what they need" | Adds a whole API layer, schema maintenance, N+1 query problems, caching complexity for a site that serves its own frontend | REST-style server components with direct DB access; no API layer needed |

## Feature Dependencies

```
[repo_trends cache table]
    +--requires--> [daily refresh task]
    +--enables---> [sort by daily/weekly/monthly/yearly trends]
    +--enables---> [activity_score computation]
    +--enables---> [popularity_score computation]

[project_trends cache table]
    +--requires--> [repo_trends cache table]
    +--requires--> [daily refresh task]
    +--enables---> [sort by monthly downloads / usage_score]
    +--enables---> [relevance_score computation]
    +--enables---> [UI labels (trending, hot, cold, frozen)]

[DB list queries]
    +--requires--> [repo_trends cache table]
    +--requires--> [project_trends cache table]
    +--enables---> [sort options on /projects page]
    +--enables---> [home page hot projects]
    +--enables---> [home page newest projects]

[multi-tag filtering]
    +--requires--> [DB list queries] (project_tags join)
    +--enables---> [relevant tag suggestions]

[text search (ILIKE)]
    +--requires--> [DB list queries]
    +--enhances--> [search palette "Search for..." path]

[relevance_score quality floor]
    +--requires--> [project_trends cache table]
    +--enhances--> [all list queries] (WHERE clause filter)

[dual-run validation]
    +--requires--> [DB list queries]
    +--requires--> [existing static JSON queries]
    +--enables---> [confidence to cut over]
```

### Dependency Notes

- **All sort options require cache tables:** Without `repo_trends` and `project_trends`, there is nothing to ORDER BY. Cache tables are the foundation.
- **Cache tables require the daily refresh task:** Stale cache = wrong rankings. The refresh task must run before any DB queries are meaningful.
- **Relevant tags require DB list queries:** Tag suggestions are computed from the filtered result set, so the query must run first.
- **Dual-run validation requires both old and new paths:** Cannot validate parity without keeping static JSON alive alongside DB queries.
- **UI labels require project_trends but no DB changes:** Labels are derived at render time from score thresholds; purely a presentation concern.

## MVP Definition

### Launch With (v1)

- [ ] `repo_trends` cache table with daily/weekly/monthly/yearly star deltas and `popularity_score`, `activity_score` -- foundation for all trend sorts
- [ ] `project_trends` cache table with `usage_score`, `relevance_score` -- completes the scoring system
- [ ] Daily refresh task that populates both cache tables -- keeps data current
- [ ] DB-backed `/projects` page with all 9 non-bookmark sort options -- replaces mingo queries
- [ ] Multi-tag filtering via DB subqueries -- matches existing `$all` semantics
- [ ] ILIKE text search for server-side search path -- replaces in-memory `filterProjectsByQuery`
- [ ] Status-based exclusion (`deprecated` filtered out) -- matches existing behavior
- [ ] Relevance score quality floor in WHERE clause -- replaces `shouldIncludeProjectInMainList()`
- [ ] Pagination with total count -- matches existing UX
- [ ] Relevant tag computation from DB results -- matches existing tag suggestion behavior

### Add After Validation (v1.x)

- [ ] Home page hot projects from DB -- switch from `api-local-json` to DB queries after `/projects` is validated
- [ ] Home page newest projects from DB -- same migration pattern
- [ ] Featured projects enrichment from DB -- replace static JSON lookup for `findRandomFeaturedProjects`
- [ ] Monthly rankings enrichment from DB -- replace `findProjects` call in `createRankingsAPI`
- [ ] UI labels (trending, hot, cold, frozen) derived from score thresholds -- cosmetic enhancement
- [ ] Dual-run validation tooling -- compare static vs DB results to build confidence before cutover

### Future Consideration (v2+)

- [ ] pg_trgm fuzzy search upgrade -- only if ILIKE proves insufficient at higher project counts
- [ ] Server-side search for command palette (replacing client-side preloaded index) -- separate effort, high risk
- [ ] Additional scoring dimensions (e.g., documentation quality, issue response time) -- requires new data sources

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Cache tables (repo_trends + project_trends) | HIGH | MEDIUM | P1 |
| Daily refresh task | HIGH | MEDIUM | P1 |
| DB-backed sort options (all 9) | HIGH | MEDIUM | P1 |
| Multi-tag filtering | HIGH | MEDIUM | P1 |
| Pagination with count | HIGH | LOW | P1 |
| Status-based exclusion | HIGH | LOW | P1 |
| Relevance quality floor | MEDIUM | LOW | P1 |
| ILIKE text search | MEDIUM | LOW | P1 |
| Relevant tag computation | MEDIUM | MEDIUM | P1 |
| Home page queries from DB | HIGH | LOW | P2 |
| Monthly rankings from DB | MEDIUM | LOW | P2 |
| UI score labels | LOW | LOW | P2 |
| Dual-run validation | HIGH | MEDIUM | P2 |
| pg_trgm fuzzy search | LOW | MEDIUM | P3 |
| Server-side search palette | MEDIUM | HIGH | P3 |

**Priority key:**
- P1: Must have for `/projects` page migration
- P2: Should have for full migration confidence and home page cutover
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | npm (npmjs.com) | GitHub Explore | Libraries.io | Snyk Advisor | Best of JS Approach |
|---------|-----------------|----------------|--------------|--------------|---------------------|
| Sort by popularity | Downloads only | Stars only | SourceRank composite | Health score | Multi-dimensional: separate popularity, activity, usage scores |
| Trend visualization | Sparkline chart | None | None | Score over time | Star deltas at 4 time windows (daily/weekly/monthly/yearly) |
| Tag/category filtering | Keywords (single) | Topics (single) | Platforms + keywords | Categories | Multi-tag intersection ($all semantics) |
| Search | Full-text with ranking | Code + repo search | Full-text | Name search | ILIKE on name+description (sufficient for curated catalog) |
| Quality signal | None explicit | None | SourceRank | Health score | Relevance score as quality floor filter |
| Activity signal | Last publish date | Last push | Dependent count | Maintenance score | activity_score from commit recency + trend momentum |
| Project count | ~2M packages | Millions of repos | ~5M libraries | ~1M packages | ~3.5k curated projects (quality over quantity) |

## Sources

- Codebase analysis: `apps/web/src/server/api-projects.tsx` (current mingo-based query system)
- Codebase analysis: `apps/web/src/components/project-list/sort-order-options.ts` (10 sort options)
- Codebase analysis: `apps/web/src/app/projects/page.tsx` (project listing page with tags, search, pagination)
- Codebase analysis: `apps/web/src/app/(home)/layout.tsx` (home page sections: hot projects, newest, featured, popular tags)
- Codebase analysis: `apps/web/src/server/api-rankings.ts` (monthly rankings enrichment)
- Codebase analysis: `apps/web/src/app/tags/tags-data-table.tsx` (tags page, already DB-backed)
- Project context: `.planning/PROJECT.md` (scoring system design, cache table architecture, status policy)

---
*Feature research for: DB-backed project listing/ranking pages*
*Researched: 2026-04-09*
