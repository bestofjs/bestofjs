export function formatNumber(value: number, formatType: "compact" | "full") {
  switch (formatType) {
    case "full":
      return formatNumberFull(value);
    default:
      return formatNumberCompact(value);
  }
}

/**
 * Format numbers with the thousand separator but no `K` prefix
 */
function formatNumberFull(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

/**
 * Format using the `K` prefix total (used for number of stars)
 */
function formatNumberCompact(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 2,
    notation: "compact",
  }).format(value);
}
