"use client";

import useSWR, { SWRConfiguration } from "swr";

import { SearchPalette } from "@/components/search-palette/search-palette";

export function SearchContainer() {
  const options: SWRConfiguration = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  };
  const { data, error } = useSWR("search-data", fetchSearchData, options);

  if (error) return <div className="text-xs">Error</div>;
  if (!data) return <div className="text-xs text-muted-foreground">...</div>;

  return <SearchPalette allProjects={data.projects} allTags={data.tags} />;
}

function fetchSearchData() {
  const url = "/api/search-data";
  return fetch(url).then((res) => res.json());
}
