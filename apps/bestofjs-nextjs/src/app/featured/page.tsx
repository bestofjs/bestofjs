import {
  ProjectSearchState,
  ProjectSearchStateParser,
} from "@/app/projects/project-search-types";
import { StarIcon } from "@/components/core";
import { PageHeading } from "@/components/core/typography";
import { ProjectPaginatedList } from "@/components/project-list/project-paginated-list";
import { getSortOptionByKey } from "@/components/project-list/sort-order-options";
import { api } from "@/server/api";

type PageProps = {
  searchParams: Record<string, string | string[]>;
};

const searchStateParser = new ProjectSearchStateParser({ sort: "newest" });
searchStateParser.path = "/featured";

export default async function FeaturedProjectsPage({
  searchParams,
}: PageProps) {
  const { searchState, buildPageURL } = searchStateParser.parse(searchParams);
  const { projects, total } = await fetchFeaturedProjects(searchState);

  return (
    <>
      <PageHeading
        icon={<StarIcon size={36} />}
        title={<>Featured Projects</>}
        subtitle={<>A collection of awesome projects chosen by our team!</>}
      />

      <ProjectPaginatedList
        projects={projects}
        total={total}
        searchState={searchState}
        buildPageURL={buildPageURL}
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
  };
}
