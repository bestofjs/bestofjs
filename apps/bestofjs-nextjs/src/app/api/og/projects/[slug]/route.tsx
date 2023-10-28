import { formatNumber } from "@/helpers/numbers";
import { api } from "@/server/api-remote-json";
import {
  Box,
  ProjectLogo,
  StarIcon,
  generateImageResponse,
  mutedColor,
} from "@/app/api/og/og-utils";

import { ImageLayout } from "../../og-image-layout";

export const runtime = "edge";

type Context = { params: { slug: string } };
export async function GET(_req: Request, { params: { slug } }: Context) {
  const project = await api.projects.getProjectBySlug(slug);
  if (!project)
    return generateImageResponse(
      <ImageLayout>
        <div>Project not found!</div>
      </ImageLayout>
    );

  return generateImageResponse(
    <ImageLayout>
      <Box style={{ alignItems: "center", gap: 48 }}>
        <ProjectLogo project={project} size={200} />
        <Box
          style={{
            flex: 1,
            flexDirection: "column",
            position: "relative",
            height: 360,
            justifyContent: "space-between",
          }}
        >
          <Box style={{ gap: 32, fontSize: 80 }}>{project.name}</Box>
          <div style={{ color: mutedColor }}>{project.description}</div>
          <Trend project={project} />
        </Box>
      </Box>
    </ImageLayout>
  );
}

function ShowStarsTotal({ value }: { value: number }) {
  return (
    <Box
      style={{ flexDirection: "row", alignItems: "center", color: mutedColor }}
    >
      <Box>{formatNumber(value, "compact")}</Box>
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
        {formatNumber(value, "compact")}
        <StarIcon />
      </Box>
      <div style={{ color: mutedColor }}>•</div>
      <div style={{ color: mutedColor }}>Total</div>
      <ShowStarsTotal value={project.stars} />
    </Box>
  ) : (
    <ShowStarsTotal value={project.stars} />
  );
}
