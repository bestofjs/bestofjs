type RepoTrendDeltas = {
  daily?: number;
  monthly?: number;
  yearly?: number;
};

/**
 * Signed log-scale blend of star momentum across daily, monthly, and yearly windows.
 * Range ~ -100 to +100. Used as the sort key for "trending".
 *
 * raw = yearly + monthly*6 + daily*180
 * score = sign(raw) * log10(1 + |raw| / 10) * 30
 */
export function computePopularityScore(trends: RepoTrendDeltas): number {
  const yearly = trends.yearly ?? 0;
  const monthly = trends.monthly ?? 0;
  const daily = trends.daily ?? 0;
  const raw = yearly + monthly * 6 + daily * 180;
  if (raw === 0) return 0;
  return Math.sign(raw) * Math.log10(1 + Math.abs(raw) / 10) * 30;
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
