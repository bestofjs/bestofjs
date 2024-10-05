import { Metadata } from "next";

import { TagPaginatedList } from "@/components/tag-list/tag-paginated-list";
import { api } from "@/server/api";
import TagListLoading from "./loading";
import {
  getTagListSortOptionByValue,
  TagSearchState,
  TagSearchStateParser,
} from "./tag-search-state";
import { TagsPageShell } from "./tags-page-shell";

type PageProps = {
  searchParams: {
    limit?: string;
    page?: string;
    sort?: string;
  };
};

const showLoadingPage = false; // for debugging purpose only

const searchStateParser = new TagSearchStateParser();

export const metadata: Metadata = {
  title: "All Tags",
};

export default async function TagsPage({ searchParams }: PageProps) {
  const { searchState, buildPageURL } = searchStateParser.parse(searchParams);
  const { tags, total } = await fetchTagsPageData(searchState);

  if (showLoadingPage) return <TagListLoading />;

  return (
    <TagsPageShell>
      <TagPaginatedList
        tags={tags}
        total={total}
        buildPageURL={buildPageURL}
        searchState={searchState}
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
