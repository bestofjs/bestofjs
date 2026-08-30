import { cacheLife, cacheTag } from "next/cache";

import type { TrendsSortKey } from "@repo/core/shared-schemas";

import {
  Box,
  generateImageResponse,
  getProjectRowStyles,
  mutedColor,
  ProjectLogo,
  StarIcon,
  TagIcon,
} from "@/app/api/og/og-utils";
import { findProjectsWithTrends, findTags } from "@/app/db";
import {
  buildTagsByCode,
  type TrendsProject,
  toTrendsProject,
} from "@/app/projects/project-adapter";
import {
  type TrendsProjectSearchState,
  TrendsProjectSearchStateParser,
} from "@/app/projects/trends-project-search-state";
import { getDeltaByDay } from "@/components/core";
import {
  getTrendsSortOptionByKey,
  type TrendsSortOption,
} from "@/components/project-list/trends-sort-order-options";
import { currentApp, type WebApp } from "@/config/apps";
import { fromNow } from "@/helpers/from-now";
import { formatNumber } from "@/helpers/numbers";
import { getSearchParamsKeyValues } from "@/lib/url-search-params";

import { ImageLayout } from "../og-image-layout";

const searchStateParser = new TrendsProjectSearchStateParser();

export async function GET(req: Request) {
  const { searchState } = getSearchStateFromURL(req.url);
  const { query, sort } = searchState;
  const sortOption = getTrendsSortOptionByKey(sort);
  const { projects, selectedTags } = await fetchOgProjects(
    searchState,
    currentApp,
  );

  return generateImageResponse(
    <ImageLayout>
      <Box style={{ gap: 32, flexDirection: "column" }}>
        <ImageCaption
          tags={selectedTags}
          query={query}
          sortOption={sortOption}
        />
        <Box style={{ flexDirection: "column" }}>
          {projects.map((project, index) => (
            <ProjectRow
              key={project.slug}
              project={project}
              index={index}
              sortOption={sortOption}
            />
          ))}
        </Box>
      </Box>
    </ImageLayout>,
  );
}

async function fetchOgProjects(
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

  const NUMBER_OF_PROJECTS = 3;
  const { tags: tagCodes, query, sort, page } = searchState;

  const [{ projects: rows }, allTags] = await Promise.all([
    findProjectsWithTrends({
      limit: NUMBER_OF_PROJECTS,
      page,
      query,
      // `scope` is deliberately NOT forwarded, so this always previews the
      // default (active) view. The image is a 3-row teaser, not a mirror of the
      // page, and previewing maintained projects is the right thing to put in
      // front of someone who hasn't clicked yet.
      //
      // Consequence, accepted: on an explicit `?scope=all` page a deprecated or
      // cold project can sit in the top 3 and won't appear here. Search pages
      // are unaffected — passing `query` makes `resolveScope()` force `"all"` on
      // both sides. Forwarding it would double the cached image variants.
      sort,
      tagCodes,
    }),
    findTags(),
  ]);

  const tagsByCode = buildTagsByCode(allTags);
  const projects = rows.map((row) => toTrendsProject(row, tagsByCode));
  const selectedTags = allTags.filter((tag) => tagCodes.includes(tag.code));

  return { projects, selectedTags };
}

function getImageTitle(tags: { name: string }[], query?: string) {
  if (!query && tags.length === 0) {
    return "All Projects";
  }
  if (!query && tags.length > 0) {
    return tags.map((tag) => tag.name).join(" + ");
  }
  return "Search results";
}

function getSearchStateFromURL(url: string) {
  const { searchParams } = new URL(url);
  const projectSearchParams = getSearchParamsKeyValues(searchParams);
  return searchStateParser.parse(projectSearchParams);
}

function ImageCaption({
  tags,
  query,
  sortOption,
}: {
  tags: { name: string }[];
  query?: string;
  sortOption: TrendsSortOption;
}) {
  return (
    <Box style={{ gap: 16, alignItems: "center" }}>
      {tags.length > 0 && !query && (
        <Box style={{ paddingLeft: 5, color: "#F59E0B" }}>
          <TagIcon size="1.75em" />
        </Box>
      )}
      <Box style={{ flexDirection: "column", paddingLeft: 0 }}>
        <Box style={{ fontSize: 48 }}>{getImageTitle(tags, query)}</Box>
        <Box style={{ fontSize: 32, color: mutedColor }}>
          {sortOption.label}
        </Box>
      </Box>
    </Box>
  );
}

function ProjectRow({
  project,
  sortOption,
  index,
}: {
  project: TrendsProject;
  sortOption: TrendsSortOption;
  index: number;
}) {
  return (
    <Box style={getProjectRowStyles({ isFirst: index === 0 })}>
      <Box>
        <ProjectLogo project={project} size={80} />
      </Box>
      <Box
        style={{
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <Box>{project.name}</Box>
        <Box>
          <ProjectScore project={project} sortOptionKey={sortOption.key} />
        </Box>
      </Box>
    </Box>
  );
}

function ProjectScore({
  project,
  sortOptionKey,
}: {
  project: TrendsProject;
  sortOptionKey: TrendsSortKey;
}) {
  const { added_at, pushed_at, contributor_count, downloads, trends } = project;
  switch (sortOptionKey) {
    case "trending": {
      // Same freshest-window fallback used in the /projects table: no single
      // raw signal maps 1:1 to the blended popularity score.
      const value = trends.yearly ?? trends.monthly ?? trends.daily;
      return value !== undefined ? (
        <ShowStarsTotal value={value} showPrefix />
      ) : null;
    }
    case "daily":
      return trends.daily !== undefined ? (
        <ShowStarsTotal value={trends.daily} showPrefix />
      ) : null;
    case "weekly":
      return <ShowStarsAverage value={getDeltaByDay("weekly")(project)} />;
    case "monthly":
      return <ShowStarsAverage value={getDeltaByDay("monthly")(project)} />;
    case "yearly":
      return <ShowStarsAverage value={getDeltaByDay("yearly")(project)} />;
    case "most-active":
      // No `last_commit` (nullable, e.g. GraphQL commit-history lookup
      // skipped/failed) → same "fully inactive" state `computeActivityScore`
      // treats as 0, so nothing to show rather than "Invalid Date".
      return pushed_at ? <Box>{fromNow(pushed_at)}</Box> : null;
    case "contributors":
      return <Box>{formatNumber(contributor_count, "compact")}</Box>;
    case "monthly-downloads":
      return <Box>{formatNumber(downloads, "compact")}</Box>;
    case "newest":
      return <Box>{added_at}</Box>;
    default: // "most-stars", "last-commit", "created"
      return <ShowStarsTotal value={project.stars} />;
  }
}

function ShowStarsTotal({
  value,
  showPrefix,
}: {
  value: number;
  showPrefix?: boolean;
}) {
  return (
    <Box style={{ flexDirection: "row", alignItems: "center" }}>
      <Box>
        {showPrefix && value > 0 ? "+" : ""}
        {formatNumber(value, "compact")}
      </Box>
      <StarIcon />
    </Box>
  );
}

function ShowStarsAverage({ value }: { value?: number }) {
  if (value === undefined) return null;
  return (
    <Box style={{ flexDirection: "row", alignItems: "center" }}>
      {value > 0 ? "+" : ""}
      <Box>{formatNumber(value, "compact")}</Box>
      <StarIcon />
      <Box style={{ color: mutedColor }}>/day</Box>
    </Box>
  );
}
