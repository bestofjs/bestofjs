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
  const { projects } = await api.projects.findProjects({
    criteria: tags.length > 0 ? { tags: { $all: tags } } : {},
    query,
    sort: sortOption.sort,
    skip: NUMBER_OF_PROJECTS * (page - 1),
    limit: NUMBER_OF_PROJECTS,
  });

  return generateImageResponse(
    <ImageLayout>
      <ImageCaption tags={tags} query={query} sortOption={sortOption} />
      <Box style={{ flexDirection: "column" }}>
        {projects.map((project, index) => (
          <ProjectRow key={project.slug} project={project} rank={index + 1} />
        ))}
      </Box>
    </ImageLayout>
  );
}

function getImageTitle(tags: string[], query: string | null) {
  if (!query && tags.length === 0) {
    return "All Projects";
  }
  if (!query && tags.length > 0) {
    return tags.map((tag) => tag[0].toUpperCase() + tag.slice(1)).join(" + ");
  }
  return "Search results";
}

function getSearchParams(url: string) {
  const { searchParams } = new URL(url);
  const projectSearchParams: ProjectPageSearchParams = {
    tags: searchParams.getAll("tags") || undefined,
    query: searchParams.get("query") || undefined,
    page: searchParams.get("page") || undefined,
    sort: searchParams.get("sort") || undefined,
    limit: searchParams.get("limit") || undefined,
  };
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
  tags: string[];
  query: string | null;
  sortOption: SortOption;
}) {
  return (
    <Box style={{ gap: 16, alignItems: "center" }}>
      {tags.length > 0 && !query && (
        <Box style={{ paddingLeft: 5, color: "#F59E0B" }}>
          <TagIcon />
        </Box>
      )}
      <Box style={{ paddingLeft: 25 }}>{getImageTitle(tags, query)}</Box>
      <span style={{ color: "#F59E0B" }}>•</span>
      <Box style={{ color: mutedColor }}>{sortOption.label}</Box>
    </Box>
  );
}

function ProjectRow({
  project,
  rank,
}: {
  project: BestOfJS.Project;
  rank: number;
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
          <ShowStars project={project} />
        </Box>
      </Box>
    </Box>
  );
}

function ShowStars({ project }: { project: BestOfJS.Project }) {
  return (
    <Box
      style={{ flexDirection: "row", alignItems: "center", color: mutedColor }}
    >
      <Box>{formatNumber(project.stars, "compact")}</Box>
      <StarIcon />
    </Box>
  );
}
