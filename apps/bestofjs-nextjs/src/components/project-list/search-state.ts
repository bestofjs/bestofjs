"use client";

import { useSearchParams } from "next/navigation";

import {
  ProjectPageSearchParams,
  parseSearchParams,
} from "../project-list/navigation-state";

export function useSearchState() {
  const urlSearchParams = useSearchParams();
  const projectSearchParams: ProjectPageSearchParams = {
    tags: urlSearchParams.getAll("tags") || undefined,
    query: urlSearchParams.get("query") || undefined,
    page: urlSearchParams.get("page") || undefined,
    sort: urlSearchParams.get("sort") || undefined,
    limit: urlSearchParams.get("limit") || undefined,
  };
  const searchState = parseSearchParams(projectSearchParams);
  return searchState;
}
