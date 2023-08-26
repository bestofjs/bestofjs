import { ImageResponse } from "next/server";

import {
  formatBigNumber,
  getProjectAvatarUrl,
} from "@/components/core/project-utils";
import { Box, ImageLayout } from "@/app/api/og/og-utils";
import { searchClient } from "@/app/backend";

export const runtime = "edge";

const mutedColor = "#a1a1aa";

type Context = { params: { slug: string } };
export async function GET(_req: Request, { params: { slug } }: Context) {
  const project = await searchClient.getProjectBySlug(slug);
  if (!project) return <div style={{ color: "white" }}>Not found</div>;

  return new ImageResponse(
    (
      <ImageLayout>
        <div style={{ display: "flex", alignItems: "center", gap: 64 }}>
          <ProjectLogo project={project} size={200} />
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              gap: 32,
            }}
          >
            <div style={{ display: "flex", gap: 32, fontSize: 80 }}>
              {project.name}
            </div>
            <div style={{ color: "#a1a1aa" }}>{project.description}</div>
            <Trend project={project} />
          </div>
        </div>
      </ImageLayout>
    ),
    {
      width: 1280,
      height: 640,
    }
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
  return <img src={imageURL} width={size} height={size} />;
}

function ShowStarsTotal({ value }: { value: number }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        color: "#a1a1aa",
      }}
    >
      <div style={{ display: "flex" }}>{formatBigNumber(value)}</div>
      <StarIcon />
    </div>
  );
}

function StarIcon() {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      stroke-width="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"></path>
    </svg>
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

function formatDate(date: Date) {
  return date.toJSON().slice(0, 10);
}
