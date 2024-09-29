"use client";

import { usePathname, useSearchParams } from "next/navigation";

import {
  ProjectSearchStateParser,
  ProjectSearchUpdater,
} from "@/app/projects/project-search-types";
import { stateToQueryString } from "@/lib/page-search-state";
import { getSearchParamsKeyValues } from "@/lib/url-search-params";

const searchStateParser = new ProjectSearchStateParser();

export function useProjectSearchState() {
  const urlSearchParams = useSearchParams();
  const pathName = usePathname();

  const searchParamsKeyValues = getSearchParamsKeyValues(urlSearchParams);
  const shouldReadURL = pathName === "/projects"; // the palette should try to read URL params only from the projects page

  const searchState = searchStateParser.parse(
    shouldReadURL ? searchParamsKeyValues : {}
  );

  const buildPageURL = (updater: ProjectSearchUpdater) => {
    const nextState = updater(searchState);
    const queryString = stateToQueryString(nextState);
    return "/projects?" + queryString;
  };

  return { searchState, buildPageURL };
}
