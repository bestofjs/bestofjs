import { encode } from "qss";

import { ProjectSearchState } from "@/app/projects/project-search-types";
import { SortOptionKey } from "./sort-order-options";

const DEFAULT_NUMBER_OF_PROJECTS_BY_PAGE = 30;
const DEFAULT_SEARCH_ORDER: SortOptionKey = "total";

// Raw params values from URLSearchParams.get() and .getAll() methods, before any parsing
export type ProjectPageSearchParams = {
  tags?: string[];
  query?: string;
  page?: string;
  limit?: string;
  sort?: string;
};

export function stateToQueryString({
  query,
  tags,
  sort,
  direction,
  page,
}: ProjectSearchState) {
  const params = {
    query: query || undefined,
    tags: tags.length === 0 ? undefined : tags,
    sort,
    page: page === 1 ? undefined : page,
    direction,
  };

  const queryString = encode(params);
  return queryString;
}

export function parseSearchParams(
  params: ProjectPageSearchParams,
  defaultParams?: Partial<ProjectSearchState>
): ProjectSearchState {
  return {
    query: params.query || "", // TODO clean input?
    tags: toArray(params.tags),
    page: toInteger(params.page, 1),
    limit: toInteger(params.limit, DEFAULT_NUMBER_OF_PROJECTS_BY_PAGE),
    sort: (params.sort ||
      defaultParams?.sort ||
      DEFAULT_SEARCH_ORDER) as SortOptionKey,
  };
}

function toInteger(input: string | undefined, defaultValue = 1) {
  if (!input) return defaultValue;
  return isNaN(Number(input)) ? defaultValue : parseInt(input, 0);
}

function toArray(input: string | string[] | undefined) {
  if (!input) return [];
  return Array.isArray(input) ? input : [input];
}
