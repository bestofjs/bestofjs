# Project scoring

How Best of JS scores projects for the DB-backed listing and search pages, and why the formulas are what they are. This is the source of truth for scoring decisions; the [PRD](../prd/replace-static-api-with-db.md) documents the original design but is a point-in-time document.

## Overview

Two cache tables store pre-computed scores, refreshed daily by the `daily-update-trends` backend pipeline (cleanup → `update-repo-trends` → `update-project-trends`):

- **`repo_trends`** (one row per repo): raw star deltas (`daily`, `weekly`, `monthly`, `quarterly`, `yearly`) plus `popularity_score` and `activity_score`
- **`project_trends`** (one row per project, including deprecated ones): primary package, `monthly_downloads`, `usage_score` and `relevance_score`

The three dimension scores (popularity, activity, usage) serve as **sort keys**, and popularity and activity also drive the [UI labels and the `scope` filter](#ui-labels-and-the-scope-filter). The composite `relevance_score` was the listing's quality floor and now has **no consumer** — see below.

The pure functions live in `packages/core/src/services/repo-trends/scoring.ts` and `packages/core/src/services/project-trends/scoring.ts`, with unit tests pinning the anchors. Scores are stored, not computed at query time: after changing a formula, re-run the pipeline to see any effect.

## `popularity_score` — star momentum

```
raw   = yearly + monthly * 6
score = sign(raw) * log10(1 + |raw| / 10) * 30
```

Range ~ −100 to +100 (raw +1000/year ≈ 60, +10k/year ≈ 90). Sort key for **Trending**.

**Why daily and weekly are excluded:** GitHub stars have mysterious one-day spikes and drops — spam-account purges, viral bursts. The original formula (`yearly + monthly*6 + daily*180`) let a single day outweigh a year: TanStack Query, at +4.1K stars/year, scored **−46.8** because of one −30 purge day (`−30 × 180 = −5400` vs `4100 + 984` of genuine growth). Monthly and yearly windows dilute this noise. The daily signal keeps its own dedicated sort ("Daily").

**Young-repo fallback:** repos tracked for less than a month have no monthly delta yet. The monthly momentum is then extrapolated from the freshest window available — `weekly*4`, then `daily*30` — so a hot new project still surfaces in "Trending" during its first weeks. Once a real monthly delta exists, daily/weekly are ignored entirely.

## `activity_score` — maintenance

```
base  = 100 * (1 - log2(days_since_last_commit / 30) / log2(365 / 30))   clamped to [-100, 100]
bonus = min(10, log2(contributors) * 3)   when contributors > 1 AND base > 0
score = base + bonus
```

Range −100…110, mirroring `popularity_score`'s signed shape. Sort key for **Most active**.

| Last commit | ≤30d | 90d | 180d | **1 year** | 2y | 3y | 10y | none |
|---|---|---|---|---|---|---|---|---|
| Score | 100 | 56 | 28 | **0** | −28 | −44 | −93 | −100 |

**Why one year is the neutral line:** it is where Best of JS has always drawn "inactive". The static API's `isInactive` rule excluded any project with no commit for over a year from the curated list, and a signed score lets that judgement flow into `relevance_score` and the `scope` filter instead of bottoming out at zero.

**Why the bonus is gated on a positive base:** community size must never soften an inactivity verdict. A 5-contributor repo dead for two years stays at −28 rather than drifting to −18.

**Why no commit date maps to −100, not 0:** under the signed scale, `0` means "a year ago" — mid-range. Returning 0 for missing commit data would quietly promote it to merely-stale.

**Ties under 30 days.** Everything committed within the last month scores 100 (plus the bonus, so contributor count breaks ties there). Exact recency ordering lives in the dedicated **Last commit** sort — the same division of labour `usage_score` has with **Monthly downloads**.

## `usage_score` — NPM adoption

```
score = max(0, min(100, (log10(monthly_downloads) - 2) * slope))
slope = 100 / (log10(2_000_000_000) - 2)   ≈ 13.7 per decade
```

Calibrated so **100 requires 2 billion downloads/month** — a ceiling only the most-downloaded npm packages approach. Anchors:

| Monthly downloads | Score |
|---|---|
| 100 | 0 |
| 10k | ~27 |
| 1M | ~55 |
| 10M | ~68 |
| 100M | ~82 |
| 1B | ~96 |
| 2B | 100 |

The original slope (100 at 10M/month) saturated hundreds of popular packages at 100.

**Not a sort key:** the **Monthly downloads** sort orders by raw `monthly_downloads`. Any log-scale score buckets projects into ties (the listing then degrades to alphabetical order); raw counts give an exact order. The score only feeds the relevance blend, where clamping is harmless.

## `relevance_score` — currently unused

```
with package:    popularity * 0.50 + activity * 0.25 + usage * 0.25
without package: popularity * 0.65 + activity * 0.35
deprecated:      minus 17
```

**This score has no consumer.** It was the listing's quality floor (`WHERE relevance_score >= 0`) until that floor was removed, and it is now computed and stored daily but read only by the `check-trends-queries` task. Since the activity recalibration, `activity` is signed here too, so inactivity subtracts rather than merely contributing nothing.

**Why a weighted sum replaced curation badly.** The static API filtered with a **veto**: over a year without a commit meant excluded, regardless of stars, unless the project was featured, promoted, or above 100k monthly downloads. A weighted sum cannot express that — any dimension compensates for any other, so a project with decent star momentum and no commits for two years still scores positive. That is why the `scope` filter (below) tests the raw signals directly instead of reviving this score.

**Why the malus is −17:** deprecated repos lose their `repo_trends` row daily (star tracking stops, a cost saving), so only usage can lift them: `usage * 0.25 − 17 ≥ 0` requires usage ≈ 68, i.e. **~10M downloads/month**.

## UI labels and the `scope` filter

Labels are derived at render time by `getProjectLabel()` (`packages/core/src/services/project-trends/labels.ts`) from data already on the row — no stored flags, no extra queries. **At most one badge per project**, first match wins, because the signals overlap heavily: a project untouched for two years has almost always stopped gaining stars too.

| | Condition | Badge |
|---|---|---|
| 1 | `projects.status = 'deprecated'` | `deprecated` |
| 2 | `activity_score < 0` (over a year without a commit) | `inactive` |
| 3 | `repo_trends.yearly < 50` | `cold` |

Null scores render no badge — they mean "not computed yet" (a project added since the last daily run), never zero.

**Every label is a caution, and that is deliberate.** There is no "trending" badge: the momentum sorts are how you look for hot projects, and an endorsement sharing this channel would weaken the warnings — plus the badge fired on most of page 1 under the default sort while being pure noise on the momentum sorts, where every top row qualifies. Removing it also removed the sort-dependent suppression the badge needed, so `getProjectLabel()` is a pure function of the project alone.

**Why `cold` reads the raw yearly delta rather than `popularity_score`:** stars almost never go *down*, so abandonment shows up as *zero* growth — and `computePopularityScore` returns exactly `0` for that, on the wrong side of any `< 0` test. The 50-stars-a-year threshold is inherited from the static API's `YEARLY_STARS_THRESHOLD`, which gated the curated list for years.

**The `scope` filter** (`findProjectsWithTrends()`'s `scope: "all" | "active"`, the listing's `?scope=` param) hides precisely the rows the first three badges name. It defaults to `"active"`, so a bare `/projects` URL is curated and `?scope=all` opts into the complete catalog — curation that is visible and switchable rather than hidden behind a number. The thresholds are exported from `labels.ts` so the SQL predicate and the badge share them; `check-trends-queries` asserts the two agree.

Its predicate is written as three independent "pass" conditions rather than `NOT (a OR b OR c)`: in SQL's three-valued logic, a project with no `repo_trends` row makes that negation `NULL` and disappears, which would silently hide every newly added project.

The reported total counts what the current filters match, `scope` included — it is a filter like the tag or text query, not a window onto a larger set, so the listing says "23 projects" rather than "23 of 64".

**Browsing is curated; searching is not.** A text `query` forces the scope to `"all"` (`resolveScope()` in `find-with-trends.ts`), and the listing hides the scope picker while a query is active. Someone typing a name wants that one project, and hiding it for being deprecated or unmaintained makes search look broken — the command palette's "Search all projects" fallback exists precisely to reach projects its own index omits, and that index already excludes deprecated ones. The rule lives in the query function so the listing page, the OG image route and `check-trends-queries` cannot disagree about it.

## Interplay with queries

Because deprecated repos have no `repo_trends` row, the listing query (`findProjectsWithTrends()` in `packages/core`) `LEFT JOIN`s both cache tables — `project_trends` too, so projects added since the last daily run are still returned, with null scores — sorts with `NULLS LAST` (trend-less projects sink instead of floating to the top of `DESC` sorts), and falls back to `COALESCE(repo_trends.stars, repos.stars)` for the star count.

| UI label | ORDER BY |
|---|---|
| Most stars (default) | `COALESCE(repo_trends.stars, repos.stars)` |
| Daily | `repo_trends.daily` |
| Weekly | `repo_trends.weekly` |
| Monthly | `repo_trends.monthly` |
| Yearly | `repo_trends.yearly` |
| Trending | `repo_trends.popularity_score` |
| Monthly downloads | `project_trends.monthly_downloads` |
| Last commit | `repos.last_commit` |
| Contributors | `repos.contributor_count` |
| Most active | `repo_trends.activity_score` |
| Created (oldest first) | `repos.created_at` |
| Newest | `projects.created_at` |

All descending except **Created**, which is ascending (oldest GitHub repo first — the one
pre-migration sort that inverts direction); `NULLS LAST`, tie-broken by `slug ASC` for deterministic
pagination. Weekly/Monthly/Yearly restore the pre-migration per-window star-delta sorts alongside
Trending's blended score; their metric column shows the plain per-day average for that window
(`getDeltaByDay()` + `StarDelta` on the web app), while Trending's column shows the freshest raw
delta available (yearly, falling back to monthly then daily) rather than the score itself, since
sorting by a metric should display that metric. **Last commit** and **Contributors** are raw signals
kept alongside — not instead of — the blended **Most active** score; they sort by `repos.last_commit`
/`repos.contributor_count` directly with no metric-column treatment (same as pre-migration, where
these two, like most other sorts, just displayed the star count).

## How to tune

1. Edit the formulas in `packages/core/src/services/{repo-trends,project-trends}/scoring.ts`, or the label thresholds in `project-trends/labels.ts`, and update the unit tests (`pnpm -F core test`)
2. Recompute the stored scores: `pnpm -F backend daily-update-trends`. **Scores are stored, not computed at query time** — until this runs, a formula change has no visible effect anywhere
3. Eyeball the result against real data: `bun run apps/backend/src/cli.ts check-trends-queries --sort trending` (see flags with `--help`; it also verifies the floor / scope / sort-order / tag-filter invariants)

To judge label thresholds across the whole catalog rather than 30 rows in a browser:

```bash
pnpm -F backend check-trends-queries --tags state --scope all --limit 64 \
  --columns rank,slug,status,popularity,activity,lastCommit,yearly,label
```

## Decision log

- **2026-07-26** — **Recalibrated `activity_score` to a signed scale** (1 year = 0, ≤30 days = 100,
  negative beyond, no commit date = −100) and rebuilt the UI labels around it. Three findings drove
  this. (1) The old `frozen` label (`activity_score === 0`) was **unreachable**: the score returned
  `decay + bonus` with an unconditional contributor bonus, so any repo with ≥2 contributors scored ≥3
  forever. (2) The old `cold` label (`popularity_score < 0`) tested the wrong side of the boundary —
  stars rarely fall, so abandonment reads as *zero* growth, which `computePopularityScore` returns
  exactly. `retalk` (no stars in 12 months, last commit 2 years ago) escaped both labels *and* the old
  relevance floor, which scored it **+7**. (3) The static API filtered with veto rules, not a score,
  which no weighted sum can reproduce.
  Consequences: labels became **one badge per row** by precedence (`deprecated` → `inactive` →
  `cold`) since the signals correlate; `frozen` became `inactive` at a reachable threshold; `cold`
  reads the raw yearly delta; and the `scope` filter was added so the curation the badges describe is
  also actionable. The contributor bonus is now gated on a positive base so community size cannot
  soften an inactivity verdict.
  Two labels from the original spec were dropped. **`widely used but unmaintained`** had no user
  story behind it, and adoption is already legible from rank and star count. **`trending`** (user
  story 12) was dropped because the momentum sorts already answer "what's hot" — the badge was noise
  on those sorts, where every top row qualifies, and near-ubiquitous on page 1 of the default sort. It
  also made every badge a caution, which is a stronger signal, and let `getProjectLabel()` go back to
  being a pure function of the project (no `sort` input, no suppression list).
- **2026-07-20** — Restored the remaining pre-migration sort keys dropped by the initial DB
  migration: **Monthly downloads** (renamed back from `"most-used"` — same underlying data, just the
  literal old key, matching the `daily` rename below), and **Last commit** / **Contributors** /
  **Created** as their own standalone sorts (`repos.last_commit`, `repos.contributor_count`,
  `repos.created_at`, all already joined in `findProjectsWithTrends()`). Last commit/Contributors sit
  alongside — not instead of — the blended **Most active** score, which was a deliberate
  consolidation the PRD made; that design intent is preserved, these are additive. Created is
  ascending (oldest first), the one sort that inverts direction.
- **2026-07-20** — Renamed the `"hot-today"` sort key to `"daily"` for consistency with
  `weekly`/`monthly`/`yearly` (all four now use their literal pre-migration key names). Caught
  because `/projects?sort=daily` — a valid URL on the pre-migration page — silently fell back to the
  default instead of sorting by the daily delta, since only this one key had been renamed.
- **2026-07-20** — Restored **Weekly**/**Monthly**/**Yearly** as their own sort options (dropped in
  the initial DB migration in favor of the blended Trending score alone) after user feedback that it
  was a real capability loss versus the pre-migration listing. Default sort changed from Trending to
  **Most stars** (Trending as a default was judged too obscure). Trending's and Most active's metric
  columns changed from showing the raw computed score (e.g. "98.3", "84") to showing a recognizable
  signal instead — Trending shows the freshest star-delta window available, Most active shows "last
  commit N days ago" — since sorting by a metric should display that metric.
- **2026-07-18** — `usage_score` recalibrated from "100 at 10M downloads/month" to "100 at 2B/month" (score saturation caused alphabetical ties); **Most used** sort switched from `usage_score` to raw `monthly_downloads`; deprecated malus adjusted −20 → −17 to preserve the ~10M visibility threshold; `popularity_score` blend changed from `yearly + monthly*6 + daily*180` to `yearly + monthly*6` with a weekly/daily extrapolation fallback for repos tracked < 1 month (one-day GitHub star purges were dominating the score — the TanStack Query case).
- **2026-05** (tasks 1–2, issues #422/#423) — initial scoring system per the [PRD](../prd/replace-static-api-with-db.md).
