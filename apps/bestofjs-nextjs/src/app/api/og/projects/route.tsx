import { api } from "@/server/api-remote-json";
import {
  Box,
  ProjectLogo,
  StarIcon,
  generateImageResponse,
  mutedColor,
} from "@/app/api/og/og-utils";
import { getHotProjectsRequest } from "@/app/backend-search-requests";

import { ImageLayout } from "../og-image-layout";

export const runtime = "edge";

export async function GET(_req: Request) {
  const NUMBER_OF_PROJECTS = 3;
  const { projects } = await api.projects.findProjects(
    getHotProjectsRequest(NUMBER_OF_PROJECTS)
  );

  const { searchParams } = new URL(_req.url);
  console.log(searchParams);

  return generateImageResponse(
    <ImageLayout>
      <Box style={{ gap: 16 }}>
        <div>All projects</div>
        <div style={{ color: mutedColor }}>1,921 projects</div>
      </Box>
      <Box style={{ flexDirection: "column" }}>
        {projects.map((project, index) => (
          <div key={project.slug}>{project.name}</div>
        ))}
      </Box>
    </ImageLayout>
  );
}

function getCaptionTitle(tags: BestOfJS.Tag[], query: string) {
  if (!query && tags.length === 0) {
    return "All Projects";
  }
  if (!query && tags.length > 0) {
    return tags.map((tag) => tag.name).join(" + ");
  }
  return "Search results";
}
