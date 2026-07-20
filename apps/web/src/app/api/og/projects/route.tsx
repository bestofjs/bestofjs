import { cacheLife, cacheTag } from "next/cache";

import { db } from "@repo/db";
import { findProjectsWithTrends } from "@repo/db/projects";
import type { TrendsSortKey } from "@repo/db/shared-schemas";
import { findTags } from "@repo/db/tags";

import {
  Box,
  generateImageResponse,
  getProjectRowStyles,
  mutedColor,
  ProjectLogo,
  StarIcon,
  TagIcon,
} from "@/app/api/og/og-utils";
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
import { fromNow } from "@/helpers/from-now";
import { formatNumber } from "@/helpers/numbers";
import { getSearchParamsKeyValues } from "@/lib/url-search-params";

import { ImageLayout } from "../og-image-layout";

const searchStateParser = new TrendsProjectSearchStateParser();

export async function GET(req: Request) {
  const { searchState } = getSearchStateFromURL(req.url);
  const { query, sort } = searchState;
  const sortOption = getTrendsSortOptionByKey(sort);
  const { projects, selectedTags } = await fetchOgProjects(searchState);

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

async function fetchOgProjects(searchState: TrendsProjectSearchState) {
  "use cache";
  cacheLife("hours");
  cacheTag("projects");

  const NUMBER_OF_PROJECTS = 3;
  const { tags: tagCodes, query, sort, page } = searchState;

  const [{ projects: rows }, allTags] = await Promise.all([
    findProjectsWithTrends({
      db,
      limit: NUMBER_OF_PROJECTS,
      page,
      query,
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
  const { created_at, pushed_at, contributor_count, downloads, trends } =
    project;
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
      return trends.daily ? (
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
      return <Box>{created_at}</Box>;
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
