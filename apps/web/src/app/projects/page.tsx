import { Suspense } from "react";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import NextLink from "next/link";

import { db } from "@repo/db";
import { findProjectsWithTrends } from "@repo/db/projects";
import { findRelevantTags, findTags } from "@repo/db/tags";

import {
  buildTagsByCode,
  type TrendsProject,
  toTrendsProject,
} from "@/app/projects/project-adapter";
import { PlusIcon, TagIcon, XMarkIcon } from "@/components/core";
import { PageHeading } from "@/components/core/typography";
import { TrendsProjectPaginatedList } from "@/components/project-list/trends-project-paginated-list";
import { getTrendsSortOptionByKey } from "@/components/project-list/trends-sort-order-options";
import { badgeVariants } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { APP_CANONICAL_URL, APP_DISPLAY_NAME } from "@/config/site";
import { formatNumber } from "@/helpers/numbers";
import { addCacheBustingParam, getStartOfUtcDay } from "@/helpers/url";
import { cn } from "@/lib/utils";

import { ProjectListLoading } from "./loading-state";
import {
  type TrendsProjectSearchState,
  TrendsProjectSearchStateParser,
  type TrendsProjectSearchUrlBuilder,
} from "./trends-project-search-state";

type TagSummary = { code: string; name: string };

type ProjectsPageData = {
  projects: TrendsProject[];
  total: number;
  selectedTags: TagSummary[];
  relevantTags: TagSummary[];
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[]>>;
};

const searchStateParser = new TrendsProjectSearchStateParser();

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const { searchState } = searchStateParser.parse(searchParams);
  const data = await fetchPageData(searchState);

  const title = getPageTitle(data, searchState);
  const description = getPageDescription(data, searchState);

  const queryString = searchStateParser.stringify(searchState);
  const imageSearchParams = new URLSearchParams(queryString);
  addCacheBustingParam(imageSearchParams, getStartOfUtcDay());

  return {
    title,
    description,
    // Text-search result pages are ephemeral/near-infinite; keep them out of
    // the index. The bare listing and tag-filtered pages stay indexable.
    ...(searchState.query ? { robots: { index: false } } : {}),
    openGraph: {
      images: [`api/og/projects/?${imageSearchParams.toString()}`],
      url: `${APP_CANONICAL_URL}/projects/?${queryString}`,
      title: `${title} • ${APP_DISPLAY_NAME}`,
      description,
    },
  };
}

function getPageTitle(
  data: ProjectsPageData,
  searchState: TrendsProjectSearchState,
) {
  const { query } = searchState;
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

function getPageDescription(
  data: ProjectsPageData,
  searchState: TrendsProjectSearchState,
) {
  const { query, sort } = searchState;
  const NUMBER_OF_PROJECTS = 8;
  const { projects, selectedTags: tags, total } = data;
  const projectNames = projects
    .map((project) => project.name)
    .slice(0, NUMBER_OF_PROJECTS)
    .join(", ");
  const tagNames = tags.map((tag) => `“${tag.name}“`).join(" + ");
  const sortOptionLabel = getTrendsSortOptionByKey(sort).label.toLowerCase();

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

export default async function ProjectsPage(props: PageProps) {
  return (
    <Suspense fallback={<ProjectListLoading />}>
      <ProjectsPageContent {...props} />
    </Suspense>
  );
}

async function ProjectsPageContent(props: PageProps) {
  const searchParams = await props.searchParams;

  const { searchState, buildPageURL } = searchStateParser.parse(searchParams);
  const { projects, total, selectedTags, relevantTags } =
    await fetchPageData(searchState);

  const { query } = searchState;

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
      <TrendsProjectPaginatedList
        projects={projects}
        total={total}
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
  tags: TagSummary[];
  searchState: TrendsProjectSearchState;
  total: number;
}) {
  const { query } = searchState;
  const showingAllProjects = !query && tags.length === 0;
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
        icon={<TagIcon className="size-8" />}
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
      <span className="px-2 text-(--icon-color)">•</span>
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
  tags: TagSummary[];
  buildPageURL: TrendsProjectSearchUrlBuilder;
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
            {showIcon && <PlusIcon className="size-5" />}
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
  tags: TagSummary[];
  buildPageURL: TrendsProjectSearchUrlBuilder;
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
            <XMarkIcon className="size-5" />
          </NextLink>
        );
      })}
      {textQuery && (
        <NextLink
          href={buildPageURL((state: TrendsProjectSearchState) => ({
            ...state,
            page: 1,
            query: "",
          }))}
          className={cn(badgeVariants({ variant: "default" }), "text-md")}
        >
          "{textQuery}"
          <XMarkIcon className="size-5" />
        </NextLink>
      )}
    </div>
  );
}

async function fetchPageData(
  searchState: TrendsProjectSearchState,
): Promise<ProjectsPageData> {
  "use cache";
  cacheLife("hours");
  cacheTag("projects");

  const { tags: tagCodes, sort, page, limit, query } = searchState;

  const [{ projects: rows, total }, allTags, relevantTags] = await Promise.all([
    findProjectsWithTrends({ db, limit, page, query, sort, tagCodes }),
    findTags(),
    findRelevantTags({ db, tagCodes, query }),
  ]);

  const tagsByCode = buildTagsByCode(allTags);
  const projects = rows.map((row) => toTrendsProject(row, tagsByCode));
  const selectedTags = allTags.filter((tag) => tagCodes.includes(tag.code));

  return {
    projects,
    total,
    selectedTags,
    relevantTags,
  };
}
