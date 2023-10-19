import { formatNumber } from "@/helpers/numbers";
import { TagIcon } from "@/components/core";
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
import { Box, generateImageResponse, mutedColor } from "@/app/api/og/og-utils";

import { ImageLayout } from "../og-image-layout";
import { ProjectRow } from "../og-utils";

export const runtime = "edge";

export async function GET(_req: Request) {
  const { tags, query, sort, page, limit } = useSearchParams(_req.url);
  const sortOption = getSortOption(sort);
  const { projects, total } = await api.projects.findProjects({
    criteria: tags.length > 0 ? { tags: { $all: tags } } : {},
    query,
    sort: sortOption.sort,
    skip: limit * (page - 1),
    limit,
  });

  return generateImageResponse(
    <ImageLayout>
      {createCaption(tags, query, total)}
      <Box style={{ flexDirection: "column" }}>
        {projects.map((project, index) => (
          <ProjectRow key={project.slug} project={project} rank={index + 1} />
        ))}
      </Box>
    </ImageLayout>
  );
}

function createCaption(tags: string[], query: string | null, total: number) {
  return (
    <Box style={{ display: "flex", gap: 16, alignItems: "center" }}>
      {tags.length > 0 && !query && (
        <div style={{ display: "flex", color: "#F59E0B" }}>
          <TagIcon/>
        </div>
      )}
      <div>{getImageTitle(tags, query)}</div>
      <ShowNumberOfProject count={total} />
    </Box>
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

function useSearchParams(url: string) {
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

function ShowNumberOfProject({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", columnGap: "0.5rem" }}>
      <span style={{ color: "#F59E0B" }}>•</span>
      <span style={{ color: mutedColor }}>
        {count === 1
          ? "One project"
          : `${formatNumber(count, "full")} projects`}
      </span>
    </div>
  );
}
