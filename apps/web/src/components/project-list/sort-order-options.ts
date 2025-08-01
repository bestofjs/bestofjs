import { keyBy } from "es-toolkit";

export const sortOptionsMap = {
  TOTAL: "total",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly",
  MONTHLY_DOWNLOADS: "monthly-downloads",
  LAST_COMMIT: "last-commit",
  CONTRIBUTORS: "contributors",
  CREATED: "created",
  NEWEST: "newest",
  BOOKMARK: "bookmark",
} as const;

type SortOptionMap = typeof sortOptionsMap;
export type SortOptionKey = SortOptionMap[keyof SortOptionMap];

export type SortOption = {
  key: SortOptionKey;
  label: string;
  shortLabel?: string;
  sort: { [key: string]: number };
  disabled?: (params: { query: string }) => boolean;
};

export const sortOrderOptions: SortOption[] = [
  {
    key: "total",
    label: "By total number of stars",
    sort: { stars: -1 },
  },
  {
    key: "daily",
    label: "By stars added yesterday",
    shortLabel: "Today",
    sort: { "trends.daily": -1 },
  },
  {
    key: "weekly",
    label: "By stars added the last 7 days",
    shortLabel: "Last 7 days",
    sort: { "trends.weekly": -1 },
  },
  {
    key: "monthly",
    label: "By stars added the last 30 days",
    shortLabel: "Last 30 days",
    sort: { "trends.monthly": -1 },
  },
  {
    key: "yearly",
    label: "By stars added the last 12 months",
    shortLabel: "Last 12 months",
    sort: { "trends.yearly": -1 },
  },
  {
    key: "monthly-downloads",
    label: "By downloads the last 30 days",
    sort: { downloads: -1 },
  },
  {
    key: "last-commit",
    label: "By date of the latest commit",
    sort: { pushed_at: -1 },
  },
  {
    key: "contributors",
    label: "By number of contributors",
    sort: { contributor_count: -1 },
  },
  {
    key: "created",
    label: "By date of creation (Oldest first)",
    sort: { created_at: 1 },
  },
  {
    key: "newest",
    label: "By date of addition on Best of JS",
    sort: { added_at: -1 },
  },
];

export const sortOrderOptionsByKey = keyBy(
  sortOrderOptions,
  (item) => item.key,
) as Record<SortOptionKey, SortOption>;

export function getSortOptionByKey(sortKey: string): SortOption {
  const defaultOption = sortOrderOptionsByKey.daily;
  if (!sortKey) return defaultOption;
  return sortOrderOptionsByKey[sortKey as SortOptionKey] || defaultOption;
}
