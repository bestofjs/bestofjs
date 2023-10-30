import { api } from "@/server/api-remote-json";
import { getHotProjectsRequest } from "@/app/backend-search-requests";

import { ImageLayout } from "./og-image-layout";
import {
  Box,
  ProjectLogo,
  StarIcon,
  generateImageResponse,
  getProjectRowStyles,
  mutedColor,
} from "./og-utils";

export const runtime = "edge";

export async function GET() {
  const NUMBER_OF_PROJECTS = 3;
  const { projects } = await api.projects.findProjects(
    getHotProjectsRequest(NUMBER_OF_PROJECTS)
  );

  return generateImageResponse(
    <ImageLayout>
      <Box style={{ gap: 16, fontSize: 48 }}>
        <div>Hot Projects Today</div>
        <div style={{ color: mutedColor }}>
          {" • " + formatDate(new Date())}
        </div>
      </Box>
      <Box style={{ flexDirection: "column" }}>
        {projects.map((project, index) => (
          <ProjectRow key={project.slug} project={project} index={index} />
        ))}
      </Box>
    </ImageLayout>
  );
}

function ProjectRow({
  project,
  index,
}: {
  project: BestOfJS.Project;
  index: number;
}) {
  return (
    <Box style={getProjectRowStyles({ isFirst: index === 0 })}>
      <Box style={{ color: mutedColor }}>#{index + 1}</Box>
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
    <Box style={{ flexDirection: "row", alignItems: "center" }}>
      <Box>{`+${project.trends.daily}`}</Box>
      <StarIcon />
    </Box>
  );
}

function formatDate(date: Date) {
  return date.toJSON().slice(0, 10);
}
