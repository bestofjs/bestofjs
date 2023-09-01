import numeral from "numeral";

/**
 * Format numbers with the thousand separator but no `k` prefix
 */
export function formatNumberFull(value: number) {
  return numeral(value).format();
}
