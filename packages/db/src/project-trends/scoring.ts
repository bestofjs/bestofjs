/**
 * Log10 of monthly downloads, scaled into 0–100. Used as the sort key for "most used".
 *
 * score = max(0, min(100, (log10(downloads) - 2) * 20))
 *
 * Anchors: 100 downloads → 0, 10k → 40, 100k → 60, 1M → 80, 10M → 100.
 * No or zero downloads → 0.
 */
export function computeUsageScore(monthlyDownloads: number | null | undefined) {
  if (!monthlyDownloads || monthlyDownloads <= 0) return 0;
  const raw = (Math.log10(monthlyDownloads) - 2) * 20;
  return Math.max(0, Math.min(100, raw));
}

/**
 * Weighted blend of popularity + activity + (usage when a package is linked),
 * with a -20 malus for deprecated projects. Used only as a `WHERE` filter
 * (`relevance_score >= 0`), never as an `ORDER BY` key.
 *
 *   with package:    0.50 * popularity + 0.25 * activity + 0.25 * usage
 *   no package:      0.65 * popularity + 0.35 * activity
 *   minus 20 if deprecated.
 */
export function computeRelevanceScore({
  popularityScore,
  activityScore,
  usageScore,
  isDeprecated = false,
}: {
  popularityScore: number;
  activityScore: number;
  usageScore?: number;
  isDeprecated?: boolean;
}) {
  const hasPackage = typeof usageScore === "number";
  const blend = hasPackage
    ? popularityScore * 0.5 + activityScore * 0.25 + usageScore * 0.25
    : popularityScore * 0.65 + activityScore * 0.35;
  return isDeprecated ? blend - 20 : blend;
}
