import { cacheLife, cacheTag } from "next/cache";

import { findProjectsWithTrends, findTags } from "@/app/db";
import {
  buildTagsByCode,
  toTrendsProject,
} from "@/app/projects/project-adapter";
import {
  type TrendsProjectSearchState,
  TrendsProjectSearchStateParser,
} from "@/app/projects/trends-project-search-state";
import { StarIcon } from "@/components/core";
import { PageHeading } from "@/components/core/typography";
import { TrendsProjectPaginatedList } from "@/components/project-list/trends-project-paginated-list";
import { currentApp, type WebApp } from "@/config/apps";

type PageProps = {
  searchParams: Promise<Record<string, string | string[]>>;
};

const searchStateParser = new TrendsProjectSearchStateParser({
  sort: "newest",
  scope: "all",
});
searchStateParser.path = "/featured";

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

async function fetchFeaturedProjects(
  searchState: TrendsProjectSearchState,
  app: WebApp,
) {
  "use cache";
  cacheLife("hours");
  // `app` is a real function parameter (not a module-scope import) because
  // Next's "use cache" excludes module-scope values from the cache key
  // (github.com/vercel/next.js#74498) — and `findProjectsWithTrends()` applies
  // this deployment's excluded tags inside `@/app/db`, which the compiler
  // can't see into from here.
  cacheTag("projects", app);

  const { sort, page, limit } = searchState;

  const [{ projects: rows, total }, allTags] = await Promise.all([
    findProjectsWithTrends({
      limit,
      page,
      // Hardcoded, not read from `searchState`: "featured" is an editorial
      // signal, and `status: "featured"` already excludes deprecated projects
      // (`projects.status` is a single enum column). `"active"` would only
      // *additionally* hide featured projects that went cold or quiet — exactly
      // the ones a curator needs listed — and would hide freshly-added ones
      // until their first commit-history fetch replaces the
      // `activity_score = -100` sentinel.
      scope: "all",
      sort,
      status: "featured",
    }),
    findTags(),
  ]);

  const tagsByCode = buildTagsByCode(allTags);

  return {
    projects: rows.map((row) => toTrendsProject(row, tagsByCode)),
    total,
  };
}
