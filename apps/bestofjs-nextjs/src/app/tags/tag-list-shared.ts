import { encode } from "qss";

import { PaginationProps } from "@/app/projects/types";

export const tagListSortSlugs = {
  ALPHA: "alpha",
  PROJECT_COUNT: "project-count",
} as const;

type TagListSortMap = typeof tagListSortSlugs;
export type TagListSortSlug = TagListSortMap[keyof TagListSortMap]; // querystring `&sort=` parameter

export type TagSearchQuery = {
  sortOptionId: TagListSortSlug;
} & PaginationProps;

export function tagSearchStateToQueryString({
  sortOptionId,
  page,
}: TagSearchQuery) {
  const params = {
    sort: sortOptionId || undefined,
    page: page === 1 ? undefined : page,
  };

  const queryString = encode(params);
  return queryString;
}

export type TagListSortOption = {
  value: TagListSortSlug;
  text: string;
  sort: { [key: string]: 1 | -1 };
};

export const tagListSortOptions: TagListSortOption[] = [
  {
    value: "project-count",
    text: "By number of projects",
    sort: { counter: -1 },
  },
  {
    value: "alpha",
    text: "Alphabetical order",
    sort: { name: 1 },
  },
];

export function getTagListSortOptionByValue(sortOptionValue: string) {
  const sortOption = tagListSortOptions.find(
    (option) => option.value === sortOptionValue
  );
  return sortOption || tagListSortOptions[0];
}
