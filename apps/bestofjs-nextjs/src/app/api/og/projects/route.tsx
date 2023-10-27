import { formatNumber } from "@/helpers/numbers";
import {
  ProjectPageSearchParams,
  parseSearchParams,
} from "@/components/project-list/navigation-state";
import {
  SortOption,
  SortOptionKey,
  sortOrderOptionsByKey,
} from "@/components/project-list/sort-order-options";
import { api } from "@/server/api-remote-json";
import {
  Box,
  ProjectLogo,
  StarIcon,
  TagIcon,
  generateImageResponse,
  mutedColor,
} from "@/app/api/og/og-utils";

import { ImageLayout } from "../og-image-layout";

export const runtime = "edge";

export async function GET(req: Request) {
  const NUMBER_OF_PROJECTS = 3;
  const { tags, query, sort, page } = getSearchParams(req.url);
  const sortOption = getSortOption(sort);
  const { projects, selectedTags } = await api.projects.findProjects({
    criteria: tags.length > 0 ? { tags: { $all: tags } } : {},
    query,
    sort: sortOption.sort,
    skip: NUMBER_OF_PROJECTS * (page - 1),
    limit: NUMBER_OF_PROJECTS,
  });

  return generateImageResponse(
    <ImageLayout>
      <ImageCaption tags={selectedTags} query={query} sortOption={sortOption} />
      <Box style={{ flexDirection: "column" }}>
        {projects.map((project, index) => (
          <ProjectRow
            key={project.slug}
            project={project}
            rank={index + 1}
            sortOption={sortOption}
          />
        ))}
      </Box>
    </ImageLayout>
  );
}

function getImageTitle(tags: BestOfJS.Tag[], query?: string) {
  if (!query && tags.length === 0) {
    return "All Projects";
  }
  if (!query && tags.length > 0) {
    return tags.map((tag) => tag.name).join(" + ");
  }
  return "Search results";
}

function getSearchParams(url: string) {
  const { searchParams } = new URL(url);
  const projectSearchParams = {
    ...Object.fromEntries(searchParams.entries()),
    tags: searchParams.getAll("tags"), // take into account multiple tags
  } as ProjectPageSearchParams;
  return parseSearchParams(projectSearchParams);
}

function getSortOption(sortKey: string): SortOption {
  const defaultOption = sortOrderOptionsByKey.daily;
  if (!sortKey) return defaultOption;
  return sortOrderOptionsByKey[sortKey as SortOptionKey] || defaultOption;
}

function ImageCaption({
  tags,
  query,
  sortOption,
}: {
  tags: BestOfJS.Tag[];
  query?: string;
  sortOption: SortOption;
}) {
  return (
    <Box style={{ gap: 16, alignItems: "center" }}>
      {tags.length > 0 && !query && (
        <Box style={{ paddingLeft: 5, color: "#F59E0B" }}>
          <TagIcon />
        </Box>
      )}
      <Box style={{ flexDirection: "column", paddingLeft: 25 }}>
        <Box style={{}}>{getImageTitle(tags, query)}</Box>
        <Box style={{ fontSize: 32, color: mutedColor }}>
          {sortOption.label}
        </Box>
      </Box>
    </Box>
  );
}

function ProjectRow({
  project,
  rank,
  sortOption,
}: {
  project: BestOfJS.Project;
  rank: number;
  sortOption: SortOption;
}) {
  return (
    <Box
      style={{
        color: "white",
        gap: 24,
        alignItems: "center",
        borderBottom: "1px",
        borderColor: "#3d3d42",
        borderStyle: "dashed",
        borderTopWidth: rank === 1 ? 1 : 0,
        padding: "8px 0",
      }}
    >
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
  project: BestOfJS.Project;
  sortOptionKey: SortOptionKey;
}) {
  const { downloads, trends } = project;
  switch (sortOptionKey) {
    case "daily":
      return <ShowStars value={trends.daily} showPrefix />;
    case "weekly":
      return trends.weekly ? (
        <ShowStars value={trends.weekly} showPrefix />
      ) : null;
    case "monthly":
      return trends.monthly ? (
        <ShowStars value={trends.monthly} showPrefix />
      ) : null;
    case "yearly":
      return trends.yearly ? (
        <ShowStars value={trends.yearly} showPrefix />
      ) : null;
    case "monthly-downloads":
      return <Box>{formatNumber(downloads, "compact")}</Box>;
    default:
      return <ShowStars value={project.stars} />;
  }
}

function ShowStars({
  value,
  showPrefix,
}: {
  value: number;
  showPrefix?: boolean;
}) {
  return (
    <Box
      style={{ flexDirection: "row", alignItems: "center", color: mutedColor }}
    >
      <Box>
        {showPrefix && value > 0 ? "+" : ""}
        {formatNumber(value, "compact")}
      </Box>
      <StarIcon />
    </Box>
  );
}
