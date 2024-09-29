import { StarIcon } from "@/components/core";
import { PageHeading } from "@/components/core/typography";
import { ProjectPaginatedList } from "@/components/project-list/project-paginated-list";
import { getSortOptionByKey } from "@/components/project-list/sort-order-options";
import { api } from "@/server/api";
import {
  ProjectSearchState,
  ProjectSearchStateParser,
  ProjectSearchUpdater,
} from "../projects/project-search-types";

type PageProps = {
  searchParams: Record<string, string | string[]>;
};

const searchStateParser = new ProjectSearchStateParser({ sort: "newest" });

export default async function FeaturedProjectsPage({
  searchParams,
}: PageProps) {
  const searchState = searchStateParser.parse(searchParams);
  const { projects, total } = await fetchFeaturedProjects(searchState);
  const { page, limit, sort } = searchState;

  const buildPageURL = (updater: ProjectSearchUpdater) => {
    const nextState = updater(searchState);
    const queryString = searchStateParser.stringify(nextState);
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
        sort={sort}
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
}: ProjectSearchState) {
  const sortOption = getSortOptionByKey(sort);

  const { projects, total } = await api.projects.findProjects({
    criteria: { status: "featured" },
    sort: sortOption.sort,
    skip: limit * (page - 1),
    limit,
  });

  return {
    projects,
    total,
    page,
    limit,
    sort: sortOption.key,
  };
}
