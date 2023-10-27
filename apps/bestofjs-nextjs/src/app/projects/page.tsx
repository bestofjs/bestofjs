import { Metadata } from "next";
import NextLink from "next/link";

import { APP_CANONICAL_URL, APP_DISPLAY_NAME } from "@/config/site";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/helpers/numbers";
import { badgeVariants } from "@/components/ui/badge";
import { PlusIcon, TagIcon, XMarkIcon } from "@/components/core";
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

import ProjectListLoading from "./loading";
import {
  ProjectSearchQuery,
  SearchQueryUpdater,
  SearchUrlBuilder,
} from "./types";

type ProjectsPageData = {
  projects: BestOfJS.Project[];
  total: number;
  page: number;
  limit: number;
  tags: string[];
  selectedTags: BestOfJS.Tag[];
  relevantTags: BestOfJS.Tag[];
  allTags: BestOfJS.Tag[];
  sortOptionId: SortOptionKey;
};

type PageProps = {
  searchParams: ProjectPageSearchParams;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const data = await getData(searchParams);
  const searchState = parseSearchParams(searchParams);

  const title = getPageTitle(data, searchState.query);
  const description = getPageDescription(data, searchState.query);

  const queryString = stateToQueryString(searchState);

  return {
    title,
    description,
    openGraph: {
      images: [`/api/og/projects/?${queryString}`],
      url: `${APP_CANONICAL_URL}/projects/?${queryString}`,
      title: `${title} • ${APP_DISPLAY_NAME}`,
      description,
    },
  };
}

function getPageTitle(data: ProjectsPageData, query: string) {
  const { selectedTags: tags } = data;
  if (!query && tags.length === 0) {
    return "All Projects";
  }
  if (!query && tags.length > 0) {
    const tagNames = tags.map((tag) => tag.name).join(" + ");
    return `${tagNames} projects`;
  }
  return "Search results";
}

function getPageDescription(data: ProjectsPageData, query: string) {
  const NUMBER_OF_PROJECTS = 8;
  const { projects, selectedTags: tags, total } = data;
  const projectNames = projects
    .map((project) => project.name)
    .slice(0, NUMBER_OF_PROJECTS)
    .join(", ");
  const tagNames = tags.map((tag) => `“${tag.name}“`).join(" + ");
  const sortOption = getSortOption(data.sortOptionId);
  const sortOptionLabel = sortOption.label.toLowerCase();

  if (!query && tags.length === 0) {
    return `All the ${total} projects tracked by ${APP_DISPLAY_NAME}, ${sortOptionLabel}: ${projectNames}...`;
  }
  if (!query && tags.length > 0) {
    return `${total} projects tagged with ${tagNames}, ${sortOptionLabel}: ${projectNames}...`;
  }
  if (query && tags.length > 0) {
    return `${total} projects matching the query “${query}” and the tags ${tagNames}: ${projectNames}...`;
  }
  return `${total} projects matching the query “${query}”: ${projectNames}...`;
}
const showLoadingPage = false; // for debugging purpose only

export default async function Projects({ searchParams }: PageProps) {
  const {
    projects,
    page,
    limit,
    total,
    sortOptionId,
    selectedTags,
    relevantTags,
    allTags,
  } = await getData(searchParams);

  if (showLoadingPage) return <ProjectListLoading />;

  const searchState = parseSearchParams(searchParams);
  const { query } = searchState;

  const buildPageURL = (updater: SearchQueryUpdater<ProjectSearchQuery>) => {
    const nextState = updater(searchState);
    const queryString = stateToQueryString(nextState);
    return "/projects?" + queryString;
  };

  return (
    <>
      <ProjectPageHeader
        searchState={searchState}
        tags={selectedTags}
        total={total}
      />
      {(selectedTags.length > 0 || query) && (
        <CurrentTags
          tags={selectedTags}
          buildPageURL={buildPageURL}
          allTags={allTags}
          textQuery={query}
        />
      )}
      {relevantTags.length > 0 && (
        <RelevantTags tags={relevantTags} buildPageURL={buildPageURL} />
      )}
      <ProjectPaginatedList
        projects={projects}
        page={page}
        limit={limit}
        total={total}
        sortOptionId={sortOptionId}
        searchState={searchState}
        buildPageURL={buildPageURL}
      />
    </>
  );
}

function ProjectPageHeader({
  tags,
  searchState,
  total,
}: {
  tags: BestOfJS.Tag[];
  searchState: ProjectSearchQuery;
  total: number;
}) {
  const { query } = searchState;
  const showingAllProjects = query === "" && tags.length === 0;
  if (showingAllProjects) {
    return (
      <PageHeading
        title={
          <>
            All Projects
            <ShowNumberOfProject count={total} />
          </>
        }
      />
    );
  }
  if (query === "") {
    return (
      <PageHeading
        title={
          <>
            {tags.map((tag) => tag.name).join(" + ")}
            <ShowNumberOfProject count={total} />
          </>
        }
        icon={<TagIcon size={32} />}
      />
    );
  }
  return (
    <PageHeading
      title={
        <>
          Search results
          <ShowNumberOfProject count={total} />
        </>
      }
    />
  );
}

function ShowNumberOfProject({ count }: { count: number }) {
  return (
    <>
      <span className="px-2 text-yellow-500">•</span>
      <span className="text-muted-foreground">
        {count === 1
          ? "One project"
          : `${formatNumber(count, "full")} projects`}
      </span>
    </>
  );
}

function RelevantTags({
  tags,
  buildPageURL,
}: {
  tags: BestOfJS.Tag[];
  buildPageURL: SearchUrlBuilder<ProjectSearchQuery>;
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {tags.map((tag) => {
        const url = buildPageURL((state) => ({
          ...state,
          page: 1,
          tags: [...state.tags, tag.code],
        }));
        return (
          <NextLink
            key={tag.code}
            href={url}
            className={badgeVariants({ variant: "outline" })}
          >
            {tag.name}
            <PlusIcon size={20} />
          </NextLink>
        );
      })}
    </div>
  );
}

function CurrentTags({
  tags,
  textQuery,
  buildPageURL,
}: {
  tags: BestOfJS.Tag[];
  textQuery: string;
  buildPageURL: SearchUrlBuilder<ProjectSearchQuery>;
  allTags: BestOfJS.Tag[];
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {tags.map((tag) => {
        const url = buildPageURL((state) => ({
          ...state,
          page: 1,
          tags: state.tags.filter((tagCode) => tagCode !== tag.code),
        }));
        return (
          <NextLink
            key={tag.code}
            href={url}
            className={cn(badgeVariants({ variant: "default" }), "text-md")}
          >
            {tag.name}
            <XMarkIcon size={20} />
          </NextLink>
        );
      })}
      {textQuery && (
        <NextLink
          href={buildPageURL((state) => ({ ...state, page: 1, query: "" }))}
          className={cn(badgeVariants({ variant: "destructive" }), "text-md")}
        >
          “{textQuery}”
          <XMarkIcon size={20} />
        </NextLink>
      )}
    </div>
  );
}

async function getData(
  searchParams: ProjectPageSearchParams
): Promise<ProjectsPageData> {
  const { tags, sort, page, limit, query } = parseSearchParams(searchParams);
  const sortOption = getSortOption(sort);

  const { projects, selectedTags, relevantTags, total } =
    await api.projects.findProjects({
      criteria: tags.length > 0 ? { tags: { $all: tags } } : {},
      query,
      sort: sortOption.sort,
      skip: limit * (page - 1),
      limit,
    });

  const { tags: allTags } = await api.tags.findTags({});

  return {
    projects,
    total,
    page,
    limit,
    sortOptionId: sortOption.key,
    selectedTags,
    relevantTags,
    tags,
    allTags,
  };
}

function getSortOption(sortKey: string): SortOption {
  const defaultOption = sortOrderOptionsByKey.daily;
  if (!sortKey) return defaultOption;
  return sortOrderOptionsByKey[sortKey as SortOptionKey] || defaultOption;
}
