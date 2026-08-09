type RepoTrendDeltas = {
  daily?: number | null;
  weekly?: number | null;
  monthly?: number | null;
  yearly?: number | null;
};

/**
 * Signed log-scale blend of star momentum over the monthly and yearly windows.
 * Range ~ -100 to +100. Used as the sort key for "trending".
 *
 * raw = yearly + monthly*6
 * score = sign(raw) * log10(1 + |raw| / 10) * 30
 *
 * Daily and weekly deltas are deliberately excluded: GitHub stars have
 * mysterious one-day spikes (spam-account purges, viral bursts) that would
 * otherwise outweigh a whole year of genuine growth. They are only used as
 * a fallback for repos tracked for less than a month (no monthly delta yet),
 * extrapolating the freshest window available: weekly*4, then daily*30.
 */
export function computePopularityScore(trends: RepoTrendDeltas): number {
  const yearly = trends.yearly ?? 0;
  const monthly = trends.monthly ?? estimateMonthlyDelta(trends);
  const raw = yearly + monthly * 6;
  if (raw === 0) return 0;
  return Math.sign(raw) * Math.log10(1 + Math.abs(raw) / 10) * 30;
}

function estimateMonthlyDelta({ weekly, daily }: RepoTrendDeltas): number {
  if (weekly != null) return weekly * 4;
  if (daily != null) return daily * 30;
  return 0;
}

type ActivityInputs = {
  lastCommit?: Date | null;
  contributors?: number | null;
  now?: Date;
};

/** Committed within a month → the full 100. */
const FULL_SCORE_DAYS = 30;
/** A year without a commit is the neutral line: score 0, negative beyond. */
const ZERO_SCORE_DAYS = 365;
const LOG_SPAN = Math.log2(ZERO_SCORE_DAYS / FULL_SCORE_DAYS); // ≈ 3.6
const MIN_SCORE = -100;

/**
 * Signed log2 decay from days-since-last-commit, plus a small contributor
 * bonus. Range −100…110, mirroring `popularity_score`'s signed shape.
 *
 * base  = 100 * (1 - log2(days / 30) / log2(365 / 30)), clamped to [-100, 100]
 * bonus = min(10, log2(contributors) * 3) when contributors > 1 AND base > 0
 *
 * Anchors: ≤30d → 100, 90d → 56, 180d → 28, **1y → 0**, 2y → −28, 3y → −44,
 * 10y → −93. One year is the neutral line because that is where Best of JS has
 * always drawn "inactive" (the static API's `isInactive` rule excluded projects
 * with no commit for over a year), and a signed score lets that judgement carry
 * into `relevance_score` instead of bottoming out at 0.
 *
 * The bonus is gated on a positive base so community size can never soften an
 * inactivity verdict: a 5-contributor repo dead for 2 years stays at −28.
 *
 * No commit date → `MIN_SCORE`. It must not be 0, which now reads as "a year
 * ago" rather than "worst possible".
 *
 * Everything committed within the last 30 days ties at 100 (+ bonus, so the
 * contributor count breaks ties there). Exact recency ordering lives in the
 * dedicated "Last commit" sort, the same split `usage_score` has with the
 * "Monthly downloads" sort.
 */
export function computeActivityScore(inputs: ActivityInputs): number {
  const { lastCommit, contributors, now = new Date() } = inputs;
  if (!lastCommit) return MIN_SCORE;

  const days = Math.max(
    0,
    (now.getTime() - lastCommit.getTime()) / (1000 * 60 * 60 * 24),
  );

  const base =
    days <= FULL_SCORE_DAYS
      ? 100
      : Math.max(
          MIN_SCORE,
          100 * (1 - Math.log2(days / FULL_SCORE_DAYS) / LOG_SPAN),
        );

  const bonus =
    base > 0 && contributors && contributors > 1
      ? Math.min(10, Math.log2(contributors) * 3)
      : 0;

  return base + bonus;
}
