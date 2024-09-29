import { encode } from "qss";
import { z } from "zod";

import {
  PageSearchStateUpdater,
  PageSearchUrlBuilder,
  paginationSchema,
} from "@/lib/page-search-state";

export const tagListSortSlugs = {
  ALPHA: "alpha",
  PROJECT_COUNT: "project-count",
} as const;

const tagSearchSchema = paginationSchema.extend({
  sort: z.nativeEnum(tagListSortSlugs),
});

export type TagSearchState = z.infer<typeof tagSearchSchema>;

export type TagSearchUpdater = PageSearchStateUpdater<TagSearchState>;
export type TagSearchUrlBuilder = PageSearchUrlBuilder<TagSearchState>;

export function tagSearchStateToQueryString({ sort, page }: TagSearchState) {
  const params = {
    sort: sort || undefined,
    page: page === 1 ? undefined : page,
  };

  const queryString = encode(params);
  return queryString;
}

export type TagListSortOption = {
  value: TagSearchState["sort"];
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
