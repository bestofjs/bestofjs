import type { Metadata } from "next";

import { TagPaginatedList } from "@/components/tag-list/tag-paginated-list";
import { api } from "@/server/api";

import {
  getTagListSortOptionByValue,
  type TagSearchState,
  TagSearchStateParser,
} from "./tag-search-state";
import { TagsPageShell } from "./tags-page-shell";

type PageProps = {
  searchParams: Promise<{
    limit?: string;
    page?: string;
    sort?: string;
  }>;
};

const searchStateParser = new TagSearchStateParser();

export const metadata: Metadata = {
  title: "All Tags",
};

export default async function TagsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const { searchState, buildPageURL } = searchStateParser.parse(searchParams);
  const { tags, total } = await fetchTagsPageData(searchState);

  return (
    <TagsPageShell>
      <TagPaginatedList
        tags={tags}
        total={total}
        searchState={searchState}
        buildPageURL={buildPageURL}
      />
    </TagsPageShell>
  );
}

async function fetchTagsPageData(searchState: TagSearchState) {
  const { sort, page, limit } = searchState;
  const sortOption = getTagListSortOptionByValue(sort);
  const skip = limit * (page - 1);
  return await api.tags.findTagsWithProjects({
    limit,
    skip,
    sort: sortOption.sort,
  });
}
