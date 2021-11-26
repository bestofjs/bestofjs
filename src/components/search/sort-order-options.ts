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
  | "match"
  | "bookmark";

export type SortOption = {
  label: string;
  disabled?: (params: { query: string; location: any }) => boolean;
  direction?: "desc" | "asc";
};

export const sortOrderOptions: Record<SortOptionKey, SortOption> = {
  total: {
    label: "By total number of stars",
  },
  daily: {
    label: "By stars added yesterday",
  },
  weekly: {
    label: "By stars added the last 7 days",
  },
  monthly: {
    label: "By stars added the last 30 days",
  },
  yearly: {
    label: "By stars added the last 12 months",
  },
  "monthly-downloads": {
    label: "By downloads the last 30 days",
  },
  "last-commit": {
    label: "By date of the latest commit",
  },
  contributors: {
    label: "By number of contributors",
  },
  created: {
    label: "By date of creation (Oldest first)",
    direction: "asc",
  },
  newest: {
    label: "By date of addition on Best of JS",
  },
  match: {
    label: "Best matching",
    disabled: ({ query }) => query === "",
  },
  bookmark: {
    label: "By date of the bookmark",
    disabled: ({ location }) => location.pathname !== "/bookmarks",
  },
};
