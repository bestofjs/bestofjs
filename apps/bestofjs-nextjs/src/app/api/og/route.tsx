import { api } from "@/server/api-remote-json";
import { getHotProjectsRequest } from "@/app/backend-search-requests";

import { ImageLayout } from "./og-image-layout";
import { Box, ProjectRow, generateImageResponse, mutedColor } from "./og-utils";

export const runtime = "edge";

export async function GET() {
  const NUMBER_OF_PROJECTS = 3;
  const { projects } = await api.projects.findProjects(
    getHotProjectsRequest(NUMBER_OF_PROJECTS)
  );

  return generateImageResponse(
    <ImageLayout>
      <Box style={{ gap: 16 }}>
        <div>Hottest projects today</div>
        <div style={{ color: mutedColor }}>
          {"(" + formatDate(new Date()) + ")"}
        </div>
      </Box>
      <Box style={{ flexDirection: "column" }}>
        {projects.map((project, index) => (
          <ProjectRow key={project.slug} project={project} rank={index + 1} />
        ))}
      </Box>
    </ImageLayout>
  );
}

function formatDate(date: Date) {
  return date.toJSON().slice(0, 10);
}
