import { Metadata } from "next";

import { TagPaginatedList } from "@/components/tag-list/tag-paginated-list";
import { PageSearchStateUpdater } from "@/lib/page-search-state";
import { api } from "@/server/api";
import TagListLoading from "./loading";
import {
  getTagListSortOptionByValue,
  TagSearchState,
  TagSearchStateParser,
} from "./tag-search-types";
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
  const { tags, total, limit, page, sort } =
    await getTagsPageData(searchParams);

  const searchState = searchStateParser.parse(searchParams);

  function buildTagsPageURL(updater: PageSearchStateUpdater<TagSearchState>) {
    const nextState = updater(searchState);
    const queryString = searchStateParser.stringify(nextState);
    return "/tags?" + queryString;
  }

  if (showLoadingPage) return <TagListLoading />;

  return (
    <TagsPageShell>
      <TagPaginatedList
        tags={tags}
        page={page}
        limit={limit}
        total={total}
        sort={sort}
        buildTagsPageURL={buildTagsPageURL}
        searchState={searchState}
      />
    </TagsPageShell>
  );
}

async function getTagsPageData(searchParams: PageProps["searchParams"]) {
  const { sort, page, limit } = searchStateParser.parse(searchParams);
  const sortOption = getTagListSortOptionByValue(sort);
  const skip = limit * (page - 1);
  const { tags, total } = await api.tags.findTagsWithProjects({
    limit,
    skip,
    sort: sortOption.sort,
  });

  return {
    tags,
    page,
    limit,
    sort,
    total,
  };
}
