import keyBy from "lodash/keyBy";

export type SortOptionKey =
  | "total"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "monthly-downloads"
  | "contributors"
  | "created"
  | "last-commit"
  | "newest"
  | "bookmark";

export type SortOption = {
  key: SortOptionKey;
  label: string;
  sort: { [key: string]: number };
  disabled?: (params: { query: string }) => boolean;
  direction?: "desc" | "asc";
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
    sort: { "trends.daily": -1 },
  },
  {
    key: "weekly",
    label: "By stars added the last 7 days",
    sort: { "trends.weekly": -1 },
  },
  {
    key: "monthly",
    label: "By stars added the last 30 days",
    sort: { "trends.monthly": -1 },
  },
  {
    key: "yearly",
    label: "By stars added the last 12 months",
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
  // {
  //   key: "bookmark",
  //   label: "By date of the bookmark",
  //   disabled: ({ location }) => location.pathname !== "/bookmarks",
  // },
];

export const sortOrderOptionsByKey = keyBy(sortOrderOptions, "key") as Record<
  SortOptionKey,
  SortOption
>;

export function getSortOptionByKey(sortKey: string): SortOption {
  const defaultOption = sortOrderOptionsByKey.daily;
  if (!sortKey) return defaultOption;
  return sortOrderOptionsByKey[sortKey as SortOptionKey] || defaultOption;
}
