import { encode } from "qss";

import { ProjectSearchQuery } from "@/app/projects/types";

import { SortOptionKey } from "./sort-order-options";

const DEFAULT_SEARCH_ORDER = "total";

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
}: ProjectSearchQuery) {
  const params = {
    query: query || undefined,
    tags: tags.length === 0 ? undefined : tags,
    sort: sort === DEFAULT_SEARCH_ORDER ? undefined : sort,
    page: page === 1 ? undefined : page,
    direction,
  };

  const queryString = encode(params);
  return queryString;
}

export function parseSearchParams(
  params: ProjectPageSearchParams
): ProjectSearchQuery {
  return {
    query: params.query || "", // TODO clean input?
    tags: toArray(params.tags),
    page: toInteger(params.page, 1),
    limit: toInteger(params.limit, 10),
    sort: (params.sort || DEFAULT_SEARCH_ORDER) as SortOptionKey,
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
