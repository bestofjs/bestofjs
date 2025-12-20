import {
  type ProjectSearchState,
  ProjectSearchStateParser,
} from "@/app/projects/project-search-state";
import { StarIcon } from "@/components/core";
import { PageHeading } from "@/components/core/typography";
import { ProjectPaginatedList } from "@/components/project-list/project-paginated-list";
import { getSortOptionByKey } from "@/components/project-list/sort-order-options";
import { api } from "@/server/api";

type PageProps = {
  searchParams: Promise<Record<string, string | string[]>>;
};

const searchStateParser = new ProjectSearchStateParser({ sort: "newest" });
searchStateParser.path = "/featured";

export default async function FeaturedProjectsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const { searchState, buildPageURL } = searchStateParser.parse(searchParams);
  const { projects, total } = await fetchFeaturedProjects(searchState);

  return (
    <>
      <PageHeading
        icon={<StarIcon className="size-9" />}
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
