import { Metadata } from "next";

import { TagPaginatedList } from "@/components/tag-list/tag-paginated-list";
import { searchClient } from "@/app/backend";
import { SearchQueryUpdater } from "@/app/projects/types";

import TagListLoading from "./loading";
import {
  TagSearchQuery,
  getTagListSortOptionByValue,
  tagListSortSlugs,
  tagSearchStateToQueryString,
} from "./tag-list-shared";
import { TagsPageShell } from "./tags-page-shell";

type PageProps = {
  searchParams: {
    limit?: string;
    page?: string;
    sort?: string;
  };
};

const showLoadingPage = false; // for debugging purpose only

export const metadata: Metadata = {
  title: "All Tags",
};

export default async function TagsPage({ searchParams }: PageProps) {
  const { tags, total, limit, page, sortOptionId } = await getTagsPageData(
    searchParams
  );

  const searchState = parsePageSearchParams(searchParams);

  function buildTagsPageURL(updater: SearchQueryUpdater<TagSearchQuery>) {
    const nextState = updater(searchState);
    const queryString = tagSearchStateToQueryString(nextState);
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
        sortOptionId={sortOptionId}
        buildTagsPageURL={buildTagsPageURL}
        searchState={searchState}
      />
    </TagsPageShell>
  );
}

async function getTagsPageData(searchParams: PageProps["searchParams"]) {
  const { sortOptionId, page, limit } = parsePageSearchParams(searchParams);
  const sortOption = getTagListSortOptionByValue(sortOptionId);
  const skip = limit * (page - 1);
  const { tags, total } = await searchClient.findTagsWithProjects({
    limit,
    skip,
    sort: sortOption.sort,
  });

  return {
    tags,
    page,
    limit,
    sortOptionId,
    total,
  };
}

function parsePageSearchParams(
  searchParams: PageProps["searchParams"]
): TagSearchQuery {
  return {
    page: toInteger(searchParams.page, 1),
    limit: toInteger(searchParams.limit, 20),
    sortOptionId: (searchParams.sort ||
      tagListSortSlugs.PROJECT_COUNT) as TagSearchQuery["sortOptionId"],
  };
}

function toInteger(input: string | undefined, defaultValue = 1) {
  if (!input) return defaultValue;
  return isNaN(Number(input)) ? defaultValue : parseInt(input, 0);
}
