import { searchClient } from "@/app/backend";
import { getHotProjectsRequest } from "@/app/backend-search-requests";

import { ImageLayout } from "./og-image-layout";
import { Box, StarIcon, generateImageResponse, mutedColor } from "./og-utils";

export const runtime = "edge";

export async function GET() {
  const NUMBER_OF_PROJECTS = 3;
  const { projects } = await searchClient.findProjects(
    getHotProjectsRequest(NUMBER_OF_PROJECTS)
  );

  return generateImageResponse(
    <ImageLayout>
      <Box style={{ gap: 16 }}>
        <div>Hottest project today</div>
        <div style={{ color: mutedColor }}>
          {"(" + formatDate(new Date()) + ")"}
        </div>
      </Box>
      <Box style={{ flexDirection: "column", gap: 8 }}>
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
    <Box style={{ color: "white", gap: 24 }}>
      <Box style={{ color: mutedColor }}>#{rank}</Box>
      <div>{project.name}</div>
      <Box>
        <ShowStars project={project} />
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
