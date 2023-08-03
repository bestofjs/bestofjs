"use client";

import useSWR from "swr";

import { SearchPalette } from "@/components/search-palette/search-palette";

export function SearchContainer() {
  const { data, error } = useSWR("search-data", fetchSearchData);

  if (error) return <div className="text-xs">Unable to load data</div>;
  if (!data)
    return <div className="text-xs text-muted-foreground">Loading</div>;

  return <SearchPalette allProjects={data.projects} allTags={data.tags} />;
}

function fetchSearchData() {
  const url = "/api/search-data";
  return fetch(url).then((res) => res.json());
}
