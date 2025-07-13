"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { ProjectSearchStateParser } from "@/app/projects/project-search-state";
import { getSearchParamsKeyValues } from "@/lib/url-search-params";

const searchStateParser = new ProjectSearchStateParser();

export function useProjectSearchState() {
  const urlSearchParams = useSearchParams();
  const pathName = usePathname();

  const searchParamsKeyValues = getSearchParamsKeyValues(urlSearchParams);
  const shouldReadURL = pathName === "/projects"; // the palette should try to read URL params only from the projects page

  const { searchState, buildPageURL } = searchStateParser.parse(
    shouldReadURL ? searchParamsKeyValues : {},
  );

  return { searchState, buildPageURL };
}
