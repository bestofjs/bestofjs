import { api } from "@/server/api";
import { getHotProjectsRequest } from "@/app/backend-search-requests";

import { ImageLayout } from "./og-image-layout";
import {
  Box,
  ProjectLogo,
  StarIcon,
  generateImageResponse,
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
      <Box style={{ color: mutedColor }}>#{rank}</Box>
      <Box>
        <ProjectLogo project={project} size={80} />
      </Box>
      <Box
        style={{
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <div>{project.name}</div>
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
      <Box>{`+${project.trends.daily}`}</Box>
      <StarIcon />
    </Box>
  );
}

function formatDate(date: Date) {
  return date.toJSON().slice(0, 10);
}
