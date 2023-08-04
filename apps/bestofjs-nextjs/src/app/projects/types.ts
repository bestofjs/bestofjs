import { SortOptionKey } from "@/components/project-list/sort-order-options";

export type PaginationProps = {
  page: number;
  limit: number;
};
export type ProjectSearchQuery = {
  tags: string[];
  query: string;
  sort: SortOptionKey;
  direction?: "desc" | "asc";
} & PaginationProps;

export type SearchQueryUpdater<T> = (searchQueryState: T) => T;

export type SearchUrlBuilder<T> = (updater: SearchQueryUpdater<T>) => string;
