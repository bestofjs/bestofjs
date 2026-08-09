import { cacheLife, cacheTag } from "next/cache";

import { db } from "@repo/core";
import {
  getProjectCardData,
  type ProjectCardData,
} from "@repo/core/services/projects";

import {
  Box,
  borderColor,
  generateImageResponse,
  mutedColor,
  ProjectLogo,
  StarIcon,
} from "@/app/api/og/og-utils";
import { formatNumber } from "@/helpers/numbers";

import { ImageLayout } from "../../og-image-layout";

type Context = { params: Promise<{ slug: string }> };
export async function GET(_req: Request, props: Context) {
  const params = await props.params;

  const { slug } = params;

  const project = await getProjectData(slug);
  if (!project)
    return generateImageResponse(
      <ImageLayout>
        <div>Project not found!</div>
      </ImageLayout>,
    );

  return generateImageResponse(
    <ImageLayout>
      <Box
        style={{
          alignItems: "center",
          gap: 48,
          border: `3px solid ${borderColor}`,
          padding: "0 48px 0",
          borderRadius: 32,
        }}
      >
        <ProjectLogo project={project} size={200} />
        <Box
          style={{
            flex: 1,
            flexDirection: "column",
            position: "relative",
            gap: 32,
            borderLeft: `3px solid ${borderColor}`,
            padding: "8px 32px 24px",
          }}
        >
          <Box style={{ fontSize: getTitleFontSize(project.name) }}>
            {project.name}
          </Box>
          <div style={{ color: mutedColor }}>{project.description}</div>
          <Trend project={project} />
        </Box>
      </Box>
    </ImageLayout>,
  );
}

/**
 * Same cache tag as the project detail page (`projects/[slug]/page.tsx`), so a
 * project and its social image refresh together.
 */
async function getProjectData(slug: string) {
  "use cache";
  cacheLife("days");
  cacheTag("project-details", slug);

  return await getProjectCardData({ db, slug });
}

function getTitleFontSize(title: string) {
  if (title.length < 16) return 72;
  if (title.length < 25) return 52;
  return 44;
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

function Trend({ project }: { project: ProjectCardData }) {
  // LEFT JOIN on `repo_trends`: null for a deprecated project (no daily
  // tracking), where the card shows the star total alone.
  const value = project.weeklyStars;
  const sign = value && value > 0 ? "+" : "";
  return value !== null ? (
    <Box style={{ justifyContent: "space-between" }}>
      <Box>
        <div style={{ marginRight: 8 }}>This week:</div>
        <Box style={{ alignItems: "center" }}>
          {sign}
          {formatNumber(value, "compact")}
          <StarIcon />
        </Box>
      </Box>
      {/* <div style={{ color: mutedColor }}>•</div> */}
      <Box>
        <div style={{ color: mutedColor, marginRight: 8 }}>Total:</div>
        <ShowStarsTotal value={project.stars} />
      </Box>
    </Box>
  ) : (
    <ShowStarsTotal value={project.stars} />
  );
}
