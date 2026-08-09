import type { ProjectStatus } from "../../constants";

/**
 * The render-time warning a project carries in listings. **At most one** — the
 * signals overlap heavily (a project with no commits for two years has almost
 * always stopped gaining stars too), so a row shows only its most consequential
 * fact and the rest stays in the sort orders and the metrics column.
 *
 * Every label is a caution. Positive momentum deliberately has no badge: the
 * momentum sorts ("Trending", "Daily"…) are how you look for hot projects, and
 * mixing an endorsement into this channel would weaken the warnings.
 *
 * Returns a key, not display copy — the web app owns the wording and the colour
 * (`apps/web/src/components/core/project-labels.tsx`).
 */
export const PROJECT_LABEL_KEYS = ["deprecated", "inactive", "cold"] as const;

export type ProjectLabelKey = (typeof PROJECT_LABEL_KEYS)[number];

export type ProjectLabelInput = {
  status: ProjectStatus;
  /** Signed: negative means more than a year since the last commit. */
  activityScore: number | null;
  /** Raw star delta over the past year (`repo_trends.yearly`). */
  yearlyStars: number | null | undefined;
};

/**
 * Fewer than 50 new stars in a year. Inherited from the static API builder's
 * `YEARLY_STARS_THRESHOLD`, which gated the curated list for years. Read from
 * the raw delta rather than `popularity_score`, because a project with zero
 * growth scores exactly 0 there — on the wrong side of any `< 0` test.
 *
 * Exported because `findProjectsWithTrends()`'s `scope: "active"` filter hides
 * exactly the rows this labels: the rule is expressed twice (here in TS, there
 * in SQL), so the threshold itself must have a single home.
 */
export const COLD_YEARLY_STARS = 50;
/** The neutral line of the signed `activity_score`: one year without a commit. */
export const INACTIVE_ACTIVITY_SCORE = 0;

export function getProjectLabel({
  status,
  activityScore,
  yearlyStars,
}: ProjectLabelInput): ProjectLabelKey | null {
  // Curation beats every computed signal.
  if (status === "deprecated") return "deprecated";

  // Signed activity: < 0 means over a year without a commit, the line Best of
  // JS has always drawn. Ranked above `cold` because "has anyone touched this?"
  // decides adoption, while star momentum is a lagging proxy for the same thing.
  if (isScore(activityScore) && activityScore < INACTIVE_ACTIVITY_SCORE) {
    return "inactive";
  }

  if (typeof yearlyStars === "number" && yearlyStars < COLD_YEARLY_STARS) {
    return "cold";
  }

  return null;
}

/**
 * Null scores mean "not computed yet" — a project added since the last daily
 * run, surfaced by the LEFT JOIN in `findProjectsWithTrends()`. Never zero, and
 * never a reason to label anything: `null < 0` is `false`, but relying on that
 * coercion is how brand-new projects end up branded inactive.
 */
function isScore(value: number | null): value is number {
  return typeof value === "number";
}
