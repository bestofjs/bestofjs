/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/server";

import {
  formatBigNumber,
  getProjectAvatarUrl,
} from "@/components/core/project-utils";
import {
  Box,
  StarIcon,
  generateImageResponse,
  mutedColor,
} from "@/app/api/og/og-utils";
import { searchClient } from "@/app/backend";

import { ImageLayout } from "../../og-image-layout";

export const runtime = "edge";

type Context = { params: { slug: string } };
export async function GET(_req: Request, { params: { slug } }: Context) {
  const project = await searchClient.getProjectBySlug(slug);
  if (!project)
    return generateImageResponse(
      <ImageLayout>
        <div>Project not found!</div>
      </ImageLayout>
    );

  return generateImageResponse(
    <ImageLayout>
      <Box style={{ alignItems: "center", gap: 64 }}>
        <ProjectLogo project={project} size={200} />
        <Box style={{ flex: 1, flexDirection: "column", gap: 32 }}>
          <Box style={{ gap: 32, fontSize: 80 }}>{project.name}</Box>
          <div style={{ color: mutedColor }}>{project.description}</div>
          <Trend project={project} />
        </Box>
      </Box>
    </ImageLayout>
  );
}

function ProjectLogo({
  project,
  size,
}: {
  project: BestOfJS.Project;
  size: number;
}) {
  const imageURL = getProjectAvatarUrl(project, 100, "dark");
  return <img src={imageURL} width={size} height={size} alt={project.name} />;
}

function ShowStarsTotal({ value }: { value: number }) {
  return (
    <Box
      style={{ flexDirection: "row", alignItems: "center", color: mutedColor }}
    >
      <Box>{formatBigNumber(value)}</Box>
      <StarIcon />
    </Box>
  );
}

function Trend({ project }: { project: BestOfJS.Project }) {
  const value = project.trends.weekly;
  const sign = value && value > 0 ? "+" : "";
  return value !== undefined ? (
    <Box style={{ gap: 32 }}>
      <div>This week</div>
      <Box style={{ alignItems: "center" }}>
        {sign}
        {formatBigNumber(value)}
        <StarIcon />
      </Box>
      <div style={{ color: mutedColor }}>•</div>
      <div style={{ color: mutedColor }}>Total</div>
      <ShowStarsTotal value={project.stars} />
    </Box>
  ) : null;
}
