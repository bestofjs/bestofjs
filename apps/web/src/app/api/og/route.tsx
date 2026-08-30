import { getHotProjects } from "@/app/(home)/hot-projects";
import type { TrendsProject } from "@/app/projects/project-adapter";
import { currentApp } from "@/config/apps";

import { ImageLayout } from "./og-image-layout";
import {
  Box,
  generateImageResponse,
  getProjectRowStyles,
  mutedColor,
  ProjectLogo,
  StarIcon,
} from "./og-utils";

const NUMBER_OF_PROJECTS = 3;

export async function GET() {
  // Same helper the home page uses, tag exclusion included, so the page and its
  // own social preview cannot rank "hot projects" differently.
  const projects = await getHotProjects(
    "daily",
    currentApp,
    NUMBER_OF_PROJECTS,
  );

  return generateImageResponse(
    <ImageLayout>
      <Box style={{ gap: 32, flexDirection: "column" }}>
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
      </Box>
    </ImageLayout>,
  );
}

function ProjectRow({
  project,
  index,
}: {
  project: TrendsProject;
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

function ShowStars({ project }: { project: TrendsProject }) {
  // Undefined before a repo's first daily snapshot pair: render nothing rather
  // than "+undefined".
  if (project.trends.daily === undefined) return null;
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
