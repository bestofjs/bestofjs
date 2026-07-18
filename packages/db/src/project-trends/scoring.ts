/**
 * Log10 of monthly downloads, scaled into 0–100. Feeds the relevance blend;
 * the "most used" sort uses raw monthly downloads, not this score.
 *
 * score = max(0, min(100, (log10(downloads) - 2) * slope))
 *
 * The slope is calibrated so that 100 downloads → 0 and 2 billion → 100,
 * the ceiling only the most downloaded npm packages approach.
 * Anchors: 10k → ~27, 1M → ~55, 10M → ~68, 100M → ~82, 1B → ~96.
 * No or zero downloads → 0.
 */
const MAX_MONTHLY_DOWNLOADS = 2_000_000_000;
const USAGE_SLOPE = 100 / (Math.log10(MAX_MONTHLY_DOWNLOADS) - 2);

export function computeUsageScore(monthlyDownloads: number | null | undefined) {
  if (!monthlyDownloads || monthlyDownloads <= 0) return 0;
  const raw = (Math.log10(monthlyDownloads) - 2) * USAGE_SLOPE;
  return Math.max(0, Math.min(100, raw));
}

/**
 * Weighted blend of popularity + activity + (usage when a package is linked),
 * with a -20 malus for deprecated projects. Used only as a `WHERE` filter
 * (`relevance_score >= 0`), never as an `ORDER BY` key.
 *
 *   with package:    0.50 * popularity + 0.25 * activity + 0.25 * usage
 *   no package:      0.65 * popularity + 0.35 * activity
 *   minus 17 if deprecated — calibrated so a deprecated project needs
 *   usage ≥ 68 (~10M monthly downloads) to stay above the `>= 0` floor.
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
  return isDeprecated ? blend - 17 : blend;
}
