import { encode } from "qss";

import { PaginationProps } from "@/app/projects/types";

export type HallOfFameSearchState = {
  query: string;
} & PaginationProps;

export function buildHallOfFamePageURL(
  updater: (state: HallOfFameSearchState) => HallOfFameSearchState
) {
  const nextState = updater(state);
  const queryString = stateToQueryString(nextState);
  return "/tags?" + queryString;
}

export function stateToQueryString({ query, page }: HallOfFameSearchState) {
  const params = {
    query: query || undefined,
    page: page === 1 ? undefined : page,
  };

  const queryString = encode(params);
  return queryString;
}
