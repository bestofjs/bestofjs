/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/server";

import { APP_CANONICAL_URL } from "@/config/site";
import { getProjectAvatarUrl } from "@/components/core/project-utils";

export const mutedColor = "#a1a1aa";

export function generateImageResponse(
  content: ConstructorParameters<typeof ImageResponse>[0]
) {
  return new ImageResponse(content, {
    width: 1200,
    height: 630,
  });
}

/**
 * Just a basic flex wrapper as we need to specify "display: flex" everywhere
 */
export function Box(props: React.HTMLAttributes<HTMLDivElement>) {
  const { style, ...rest } = props;
  return <div style={{ display: "flex", ...style }} {...rest} />;
}

export function ProjectLogo({
  project,
  size,
}: {
  project: BestOfJS.Project;
  size: number;
}) {
  const imageURL = getImageAbsoluteURL(
    getProjectAvatarUrl(project, 100, "dark")
  );
  return <img src={imageURL} width={size} height={size} alt={project.name} />;
}

// Image source must be an absolute URL
function getImageAbsoluteURL(url: string) {
  const rootURL = process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : APP_CANONICAL_URL;
  return url.startsWith("http") ? url : rootURL + url;
}

export function StarIcon() {
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

export function ProjectRow({
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
