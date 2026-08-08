import { Suspense } from "react";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import NextLink from "next/link";

import { db } from "@repo/db";
import { findProjectsWithTrends, resolveScope } from "@repo/db/projects";
import { findRelevantTags, findTags } from "@repo/db/tags";

import {
  buildTagsByCode,
  type TrendsProject,
  toTrendsProject,
} from "@/app/projects/project-adapter";
import { PlusIcon, TagIcon, XMarkIcon } from "@/components/core";
import {
  LinkPendingIcon,
  LinkPendingOverlay,
} from "@/components/core/link-pending";
import { PageHeading } from "@/components/core/typography";
import { TrendsProjectPaginatedList } from "@/components/project-list/trends-project-paginated-list";
import { TrendsProjectScopePicker } from "@/components/project-list/trends-scope-picker";
import { getTrendsSortOptionByKey } from "@/components/project-list/trends-sort-order-options";
import { badgeVariants } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { APP_CANONICAL_URL, APP_DISPLAY_NAME } from "@/config/site";
import { formatNumber } from "@/helpers/numbers";
import { addCacheBustingParam } from "@/helpers/url";
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
  addCacheBustingParam(imageSearchParams, await getOgImageCacheDate());

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

async function getOgImageCacheDate() {
  "use cache";
  cacheLife("daily");
  // Rotate the OG image URL roughly once a day. This intentionally follows a
  // rolling 24-hour window rather than UTC midnight because daily rebuild
  // durations vary. A short overlap or a few premature cache misses are fine.
  return new Date();
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
  const { query, sort, scope } = searchState;
  const NUMBER_OF_PROJECTS = 8;
  const { projects, selectedTags: tags, total } = data;
  const projectNames = projects
    .map((project) => project.name)
    .slice(0, NUMBER_OF_PROJECTS)
    .join(", ");
  const tagNames = tags.map((tag) => `“${tag.name}“`).join(" + ");
  const sortOptionLabel = getTrendsSortOptionByKey(sort).label.toLowerCase();

  if (!query && tags.length === 0) {
    // "All the N projects" would be a false claim under the default `active`
    // scope, which hides deprecated, inactive and cold projects. "Active" is
    // the word the scope picker uses, and it means exactly "what this filter
    // keeps" — unlike "actively maintained", which would describe the rows
    // correctly but imply the count covers every maintained project (it does
    // not: maintained-but-cold projects are filtered out too).
    return scope === "all"
      ? `All the ${total} projects tracked by ${APP_DISPLAY_NAME}, ${sortOptionLabel}: ${projectNames}...`
      : `${total} active projects tracked by ${APP_DISPLAY_NAME}, ${sortOptionLabel}: ${projectNames}...`;
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
        buildPageURL={buildPageURL}
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
  buildPageURL,
}: {
  tags: TagSummary[];
  searchState: TrendsProjectSearchState;
  total: number;
  buildPageURL: TrendsProjectSearchUrlBuilder;
}) {
  const { query, scope } = searchState;
  // The schema normalises an empty query away, so this is just "is a query set".
  const isSearching = Boolean(query);
  // The scope the count was actually produced under, not the one in the URL: a
  // text query forces `"all"`, so a search page must not claim "active
  // projects" while listing the whole catalog.
  const effectiveScope = resolveScope(scope, query);
  // Searching always covers the whole catalog, so the picker would be inert
  // there — on those pages the subtitle carries the count alone.
  const scopePicker = isSearching ? undefined : (
    <TrendsProjectScopePicker value={scope} buildPageURL={buildPageURL} />
  );
  if (!isSearching && tags.length === 0) {
    return (
      <PageHeading
        // The title names the scope, so the count below it needs no qualifier:
        // "Active Projects" over "1,607 projects", never "1,607 active
        // projects", which would say "active" twice.
        title={effectiveScope === "active" ? "Active Projects" : "All Projects"}
        subtitle={
          <HeadingDetails
            count={total}
            noun="project"
            scopePicker={scopePicker}
          />
        }
      />
    );
  }
  if (!isSearching) {
    return (
      <PageHeading
        title={tags.map((tag) => tag.name).join(" + ")}
        subtitle={
          <HeadingDetails
            count={total}
            // The title is tag names, so the scope has to ride on the count.
            noun={getNoun(effectiveScope)}
            scopePicker={scopePicker}
          />
        }
        icon={<TagIcon className="size-6 sm:size-8" />}
      />
    );
  }
  return (
    <PageHeading
      title="Search results"
      subtitle={<HeadingDetails count={total} noun={getNoun(effectiveScope)} />}
    />
  );
}

function getNoun(scope: TrendsProjectSearchState["scope"]) {
  return scope === "active" ? "active project" : "project";
}

/**
 * The second line of the heading: how many results, and the control that
 * changes them. Its own row rather than trailing the `h1` — the count is
 * metadata about the results, not part of the page's name, and at heading size
 * it wrapped badly on phones.
 *
 * Some form of the scope always reaches the heading, in the title or in the
 * noun. That is what lets `TrendsProjectScopePicker` shrink to an icon: the
 * heading reports the state, so the control only has to offer the change. Same
 * wording as `getPageDescription()` — "active" means exactly "what the filter
 * keeps".
 */
function HeadingDetails({
  count,
  noun,
  scopePicker,
}: {
  count: number;
  noun: string;
  scopePicker?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <span>{formatCount(count, noun)}</span>
      {scopePicker}
    </div>
  );
}

function formatCount(count: number, noun: string) {
  return count === 1
    ? `One ${noun}`
    : `${formatNumber(count, "full")} ${noun}s`;
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
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "relative px-2.5",
            )}
          >
            {tag.name}
            {showIcon ? (
              <LinkPendingIcon>
                <PlusIcon className="size-5" />
              </LinkPendingIcon>
            ) : (
              <LinkPendingOverlay />
            )}
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
            <LinkPendingIcon>
              <XMarkIcon className="size-5" />
            </LinkPendingIcon>
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
          <LinkPendingIcon>
            <XMarkIcon className="size-5" />
          </LinkPendingIcon>
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

  const { tags: tagCodes, sort, page, limit, query, scope } = searchState;

  const [{ projects: rows, total }, allTags, relevantTags] = await Promise.all([
    findProjectsWithTrends({ db, limit, page, query, scope, sort, tagCodes }),
    findTags(),
    // Same `scope` as the listing: a suggested tag whose projects are all
    // filtered out would lead to an empty page.
    findRelevantTags({ db, tagCodes, query, scope }),
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
