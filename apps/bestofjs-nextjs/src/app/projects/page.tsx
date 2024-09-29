import { Metadata } from "next";
import NextLink from "next/link";

import { PlusIcon, TagIcon, XMarkIcon } from "@/components/core";
import { PageHeading } from "@/components/core/typography";
import { ProjectPaginatedList } from "@/components/project-list/project-paginated-list";
import {
  getSortOptionByKey,
  SortOptionKey,
} from "@/components/project-list/sort-order-options";
import { badgeVariants } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { APP_CANONICAL_URL, APP_DISPLAY_NAME } from "@/config/site";
import { formatNumber } from "@/helpers/numbers";
import { addCacheBustingParam } from "@/helpers/url";
import { cn } from "@/lib/utils";
import { api } from "@/server/api";
import ProjectListLoading from "./loading";
import {
  ProjectSearchState,
  ProjectSearchStateParser,
  ProjectSearchUpdater,
  ProjectSearchUrlBuilder,
} from "./project-search-types";

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
  lastUpdateDate: Date;
};

type PageProps = {
  searchParams: Record<string, string | string[]>;
};

const searchStateParser = new ProjectSearchStateParser();

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const data = await getData(searchParams);
  const searchState = searchStateParser.parse(searchParams);

  const title = getPageTitle(data, searchState.query);
  const description = getPageDescription(data, searchState.query);

  const queryString = searchStateParser.stringify(searchState);
  const urlSearchParams = new URLSearchParams(queryString);
  addCacheBustingParam(urlSearchParams, data.lastUpdateDate);

  return {
    title,
    description,
    openGraph: {
      images: [`api/og/projects/?${urlSearchParams.toString()}`],
      url: `${APP_CANONICAL_URL}/projects/?${queryString}`,
      title: `${title} • ${APP_DISPLAY_NAME}`,
      description,
    },
  };
}

function getPageTitle(data: ProjectsPageData, query?: string) {
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

function getPageDescription(data: ProjectsPageData, query?: string) {
  const NUMBER_OF_PROJECTS = 8;
  const { projects, selectedTags: tags, total } = data;
  const projectNames = projects
    .map((project) => project.name)
    .slice(0, NUMBER_OF_PROJECTS)
    .join(", ");
  const tagNames = tags.map((tag) => `“${tag.name}“`).join(" + ");
  const sortOption = getSortOptionByKey(data.sortOptionId);
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

  const searchState = searchStateParser.parse(searchParams);
  const { query } = searchState;

  const buildPageURL = (updater: ProjectSearchUpdater) => {
    const nextState = updater(searchState);
    const queryString = searchStateParser.stringify(nextState);
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
        <RelevantTags
          tags={relevantTags}
          buildPageURL={buildPageURL}
          showIcon={selectedTags.length > 0}
        />
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
  searchState: ProjectSearchState;
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
      <span className="px-2 text-[var(--icon-color)]">•</span>
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
  showIcon,
  limit = 16,
}: {
  tags: BestOfJS.Tag[];
  buildPageURL: ProjectSearchUrlBuilder;
  showIcon?: boolean;
  limit?: number;
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {tags.slice(0, limit).map((tag) => {
        const url = buildPageURL((state) => ({
          ...state,
          page: 1,
          tags: [...state.tags, tag.code],
        }));
        return (
          <NextLink
            key={tag.code}
            href={url}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            {tag.name}
            {showIcon && <PlusIcon size={20} />}
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
  buildPageURL: ProjectSearchUrlBuilder;
  allTags: BestOfJS.Tag[];
  textQuery?: string;
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
          href={buildPageURL((state: ProjectSearchState) => ({
            ...state,
            page: 1,
            query: "",
          }))}
          className={cn(badgeVariants({ variant: "default" }), "text-md")}
        >
          “{textQuery}”
          <XMarkIcon size={20} />
        </NextLink>
      )}
    </div>
  );
}

async function getData(
  searchParams: PageProps["searchParams"]
): Promise<ProjectsPageData> {
  const { tags, sort, page, limit, query } =
    searchStateParser.parse(searchParams);
  const sortOption = getSortOptionByKey(sort);

  const { projects, selectedTags, relevantTags, total, lastUpdateDate } =
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
    lastUpdateDate,
  };
}
