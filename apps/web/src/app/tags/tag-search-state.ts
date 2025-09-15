import { z } from "zod";

import {
  type PageSearchStateUpdater,
  type PageSearchUrlBuilder,
  paginationSchema,
  SearchStateParser,
} from "@/lib/page-search-state";

export const tagSortOptionsMap = {
  ALPHA: "alpha",
  PROJECT_COUNT: "project-count",
} as const;

const tagSearchStateSchema = paginationSchema.extend({
  sort: z.enum(tagSortOptionsMap).catch(tagSortOptionsMap.PROJECT_COUNT),
});

export type TagSearchState = z.infer<typeof tagSearchStateSchema>;

export type TagSearchUpdater = PageSearchStateUpdater<TagSearchState>;

export type TagSearchUrlBuilder = PageSearchUrlBuilder<TagSearchState>;

export class TagSearchStateParser extends SearchStateParser<
  typeof tagSearchStateSchema
> {
  path = "/tags";

  constructor() {
    super(tagSearchStateSchema);
  }
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
    (option) => option.value === sortOptionValue,
  );
  return sortOption || tagListSortOptions[0];
}
