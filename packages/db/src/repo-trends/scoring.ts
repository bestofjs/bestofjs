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

/**
 * Log2 decay from days-since-last-commit, plus a small contributor bonus.
 *
 * decay = max(0, 100 - log2(days+1) * 10)
 * bonus = min(10, log2(contributors) * 3) when contributors > 1, else 0
 *
 * No commit date → score 0 (treat as fully inactive).
 */
export function computeActivityScore(inputs: ActivityInputs): number {
  const { lastCommit, contributors, now = new Date() } = inputs;
  if (!lastCommit) return 0;

  const days = Math.max(
    0,
    (now.getTime() - lastCommit.getTime()) / (1000 * 60 * 60 * 24),
  );
  const decay = Math.max(0, 100 - Math.log2(days + 1) * 10);

  const bonus =
    contributors && contributors > 1
      ? Math.min(10, Math.log2(contributors) * 3)
      : 0;

  return decay + bonus;
}
