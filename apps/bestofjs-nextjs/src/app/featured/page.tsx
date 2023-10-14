import { StarIcon } from "@/components/core";
import { PageHeading } from "@/components/core/typography";
import {
  ProjectPageSearchParams,
  parseSearchParams,
  stateToQueryString,
} from "@/components/project-list/navigation-state";
import { ProjectPaginatedList } from "@/components/project-list/project-paginated-list";
import {
  SortOption,
  SortOptionKey,
  sortOrderOptionsByKey,
} from "@/components/project-list/sort-order-options";
import { api } from "@/server/api";

import { ProjectSearchQuery, SearchQueryUpdater } from "../projects/types";

type PageProps = {
  searchParams: ProjectPageSearchParams;
};

export const revalidate = 0;

export default async function FeaturedProjectsPage({
  searchParams,
}: PageProps) {
  const searchState = parseSearchParams(searchParams, { sort: "newest" });
  const { projects, total } = await fetchFeaturedProjects(searchState);
  const { page, limit, sort } = searchState;

  const buildPageURL = (updater: SearchQueryUpdater<ProjectSearchQuery>) => {
    const nextState = updater(searchState);
    const queryString = stateToQueryString(nextState);
    return "/featured?" + queryString;
  };

  return (
    <>
      <PageHeading
        icon={<StarIcon size={36} />}
        title={<>Featured Projects</>}
        subtitle={<>A collection of awesome projects chosen by our team!</>}
      />

      <ProjectPaginatedList
        projects={projects}
        page={page}
        limit={limit}
        total={total}
        sortOptionId={sort}
        searchState={searchState}
        buildPageURL={buildPageURL}
        path="/featured"
      />
    </>
  );
}

async function fetchFeaturedProjects({
  sort,
  page,
  limit,
}: ProjectSearchQuery) {
  const sortOption = getSortOption(sort);

  const { projects, total } = await api.projects.findProjects({
    criteria: { isFeatured: true },
    sort: sortOption.sort,
    skip: limit * (page - 1),
    limit,
  });

  return {
    projects,
    total,
    page,
    limit,
    sortOptionId: sortOption.key,
  };
}

function getSortOption(sortKey: string): SortOption {
  const defaultOption = sortOrderOptionsByKey.newest;
  if (!sortKey) return defaultOption;
  return (
    (sortKey in sortOrderOptionsByKey &&
      sortOrderOptionsByKey[sortKey as SortOptionKey]) ||
    defaultOption
  );
}
