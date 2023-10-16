import {
  ProjectPageSearchParams,
  parseSearchParams,
} from "@/components/project-list/navigation-state";
import { api } from "@/server/api-remote-json";
import { Box, generateImageResponse, mutedColor } from "@/app/api/og/og-utils";

import { ImageLayout } from "../og-image-layout";
import { ProjectRow } from "../route";

export const runtime = "edge";

export async function GET(_req: Request) {
  const { tags, query } = useSearchParams(_req.url);
  const { projects } = await api.projects.findProjects({ query });

  return generateImageResponse(
    <ImageLayout>
      <Box style={{ gap: 16 }}>
        <div>{getImageTitle(tags, query)}</div>
        <div style={{ color: mutedColor }}># of projects</div>
      </Box>
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
    return tags.map((tag) => tag).join(" + ");
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
