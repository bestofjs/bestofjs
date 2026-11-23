import { StarIcon } from "@/components/core";
import { PageHeading } from "@/components/core/typography";
import { TrendsProjectPaginatedList } from "@/components/project-list/trends-project-paginated-list";
import { currentApp } from "@/config/apps";
import { markdownMetadata } from "@/server/markdown/metadata";

import { fetchFeaturedProjects, searchStateParser } from "./page-data";

type PageProps = {
  searchParams: Promise<Record<string, string | string[]>>;
};

export default async function FeaturedProjectsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const { searchState, buildPageURL } = searchStateParser.parse(searchParams);
  const { projects, total } = await fetchFeaturedProjects(
    searchState,
    currentApp,
  );

  return (
    <>
      <PageHeading
        icon={<StarIcon className="size-9" />}
        title={<>Featured Projects</>}
        subtitle={<>A collection of awesome projects chosen by our team!</>}
      />

      <TrendsProjectPaginatedList
        projects={projects}
        total={total}
        searchState={searchState}
        buildPageURL={buildPageURL}
      />
    </>
  );
}

export async function generateMetadata(props: PageProps) {
  const { searchState } = searchStateParser.parse(await props.searchParams);
  const params = new URLSearchParams();
  if (searchState.page > 1) params.set("page", String(searchState.page));
  if (searchState.limit !== 30) params.set("limit", String(searchState.limit));
  if (searchState.sort !== "newest") params.set("sort", searchState.sort);
  const query = params.toString();
  return markdownMetadata(query ? `/featured?${query}` : "/featured");
}
