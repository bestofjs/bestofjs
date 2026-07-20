# Project scoring

How Best of JS scores projects for the DB-backed listing and search pages, and why the formulas are what they are. This is the source of truth for scoring decisions; the [PRD](../prd/replace-static-api-with-db.md) documents the original design but is a point-in-time document.

## Overview

Two cache tables store pre-computed scores, refreshed daily by the `daily-update-trends` backend pipeline (cleanup → `update-repo-trends` → `update-project-trends`):

- **`repo_trends`** (one row per repo): raw star deltas (`daily`, `weekly`, `monthly`, `quarterly`, `yearly`) plus `popularity_score` and `activity_score`
- **`project_trends`** (one row per project, including deprecated ones): primary package, `monthly_downloads`, `usage_score` and `relevance_score`

The three dimension scores (popularity, activity, usage) serve as **sort keys**. The composite `relevance_score` is only a **quality floor** (`WHERE relevance_score >= 0`), never an `ORDER BY`.

The pure functions live in `packages/db/src/repo-trends/scoring.ts` and `packages/db/src/project-trends/scoring.ts`, with unit tests pinning the anchors. Scores are stored, not computed at query time: after changing a formula, re-run the pipeline to see any effect.

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
decay = max(0, 100 - log2(days_since_last_commit + 1) * 10)
bonus = min(10, log2(contributors) * 3)   when contributors > 1
score = decay + bonus
```

Range 0–110. Sort key for **Most active**. Anchors: commit yesterday ≈ 90–100, 1 week ≈ 70, 1 month ≈ 50, 1 year ≈ 15, ~3 years → 0. No commit date → 0 (fully inactive, the "frozen" UI label). The small contributor bonus rewards bus-factor without letting community size dominate recency.

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

**Not a sort key:** the **Most used** sort orders by raw `monthly_downloads`. Any log-scale score buckets projects into ties (the listing then degrades to alphabetical order); raw counts give an exact order. The score only feeds the relevance blend, where clamping is harmless.

## `relevance_score` — the quality floor

```
with package:    popularity * 0.50 + activity * 0.25 + usage * 0.25
without package: popularity * 0.65 + activity * 0.35
deprecated:      minus 17
```

Used **only** as `WHERE relevance_score >= 0` in listings — never for ordering. The `/search` route drops the filter so the full catalog (including deprecated, low-signal projects) stays findable.

**Why the malus is −17:** deprecated repos lose their `repo_trends` row daily (star tracking stops, a cost saving), so their popularity and activity are 0 and only usage can keep them above the floor: `usage * 0.25 − 17 ≥ 0` requires usage ≈ 68, i.e. **~10M downloads/month**. That keeps jquery-class legacy packages visible in listings while hiding deprecated projects with no meaningful adoption. (−17 preserves the ~10M threshold the original −20 malus had under the old usage slope.)

## Interplay with queries

Because deprecated repos have no `repo_trends` row, the listing query (`findProjectsWithTrends()` in `packages/db`) uses `INNER JOIN project_trends` + `LEFT JOIN repo_trends`, sorts with `NULLS LAST` (trend-less projects sink instead of floating to the top of `DESC` sorts), and falls back to `COALESCE(repo_trends.stars, repos.stars)` for the star count.

| UI label | ORDER BY |
|---|---|
| Most stars (default) | `COALESCE(repo_trends.stars, repos.stars)` |
| Daily | `repo_trends.daily` |
| Weekly | `repo_trends.weekly` |
| Monthly | `repo_trends.monthly` |
| Yearly | `repo_trends.yearly` |
| Trending | `repo_trends.popularity_score` |
| Most active | `repo_trends.activity_score` |
| Most used | `project_trends.monthly_downloads` |
| Newest | `projects.created_at` |

All descending, `NULLS LAST`, tie-broken by `slug ASC` for deterministic pagination. Weekly/Monthly/
Yearly restore the pre-migration per-window star-delta sorts alongside Trending's blended score;
their metric column shows the plain per-day average for that window (`getDeltaByDay()` + `StarDelta`
on the web app), while Trending's column shows the freshest raw delta available (yearly, falling
back to monthly then daily) rather than the score itself, since sorting by a metric should display
that metric.

## How to tune

1. Edit the formulas in `packages/db/src/{repo-trends,project-trends}/scoring.ts` and update the unit tests (`pnpm -F db test`)
2. Recompute the stored scores: `pnpm -F backend daily-update-trends`
3. Eyeball the result against real data: `bun run apps/backend/src/cli.ts check-trends-queries --sort trending` (see flags with `--help`; it also verifies the floor / sort-order / tag-filter invariants)

## Decision log

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
