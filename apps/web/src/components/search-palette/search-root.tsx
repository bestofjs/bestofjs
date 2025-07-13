"use client";

import useSWR, { type SWRConfiguration } from "swr";

import { SearchPalette } from "@/components/search-palette/search-palette";

import { ClientSearch } from "./search-container";

type SearchData = {
  projects: BestOfJS.SearchIndexProject[];
  tags: BestOfJS.Tag[];
};

export function ClientSearchRoot() {
  const options: SWRConfiguration = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  };
  const { data, error } = useSWR<SearchData>(
    "search-data",
    fetchSearchData,
    options,
  );

  if (error) return <div className="text-xs">Error</div>;
  if (!data) return <div className="text-muted-foreground text-xs">...</div>;

  return (
    <ClientSearch.Provider initialState={data}>
      <SearchPalette />
    </ClientSearch.Provider>
  );
}

function fetchSearchData() {
  const url = "/api/search-data";
  return fetch(url).then((res) => res.json());
}
