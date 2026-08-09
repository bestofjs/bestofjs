import { keyBy } from "es-toolkit";

import type { TrendsSortKey } from "@repo/core/shared-schemas";

export type TrendsSortOption = {
  key: TrendsSortKey;
  label: string;
  shortLabel?: string;
};

// Sorting itself happens in the DB query (`findProjectsWithTrends()`); this
// file only carries display metadata for the sort dropdown.
export const trendsSortOrderOptions: TrendsSortOption[] = [
  {
    key: "most-stars",
    label: "By total number of stars",
  },
  {
    key: "daily",
    label: "By stars added yesterday",
    shortLabel: "Today",
  },
  {
    key: "weekly",
    label: "By stars added the last 7 days",
    shortLabel: "Last 7 days",
  },
  {
    key: "monthly",
    label: "By stars added the last 30 days",
    shortLabel: "Last 30 days",
  },
  {
    key: "yearly",
    label: "By stars added the last 12 months",
    shortLabel: "Last 12 months",
  },
  {
    key: "trending",
    label: "Trending (star momentum)",
    shortLabel: "Trending",
  },
  {
    key: "most-active",
    label: "Most active (maintenance)",
    shortLabel: "Active",
  },
  {
    key: "last-commit",
    label: "By date of the latest commit",
  },
  {
    key: "contributors",
    label: "By number of contributors",
  },
  {
    key: "monthly-downloads",
    label: "By downloads the last 30 days",
  },
  {
    key: "created",
    label: "By date of creation (Oldest first)",
  },
  {
    key: "newest",
    label: "Newest on Best of JS",
    shortLabel: "Newest",
  },
];

export const trendsSortOrderOptionsByKey = keyBy(
  trendsSortOrderOptions,
  (item) => item.key,
) as Record<TrendsSortKey, TrendsSortOption>;

export function getTrendsSortOptionByKey(sortKey: string): TrendsSortOption {
  const defaultOption = trendsSortOrderOptionsByKey["most-stars"];
  if (!sortKey) return defaultOption;
  return trendsSortOrderOptionsByKey[sortKey as TrendsSortKey] || defaultOption;
}
