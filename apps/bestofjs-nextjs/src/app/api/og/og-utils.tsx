/* eslint-disable @next/next/no-img-element */

import React from "react";
import { ImageResponse } from "next/og";

import { APP_CANONICAL_URL } from "@/config/site";
import { getProjectLogoUrl } from "@/components/core/project-utils";

export const mutedColor = `rgba(255, 255, 255, 0.7)`;
export const borderColor = `rgba(255, 255, 255, 0.2)`;

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

export function getProjectRowStyles({ isFirst }: { isFirst: boolean }) {
  return {
    color: "white",
    gap: 24,
    alignItems: "center",
    borderBottom: "1px",
    borderColor,
    borderTopWidth: isFirst ? 1 : 0,
    padding: "12px 0",
  };
}

export function ProjectLogo({
  project,
  size,
}: {
  project: BestOfJS.Project;
  size: number;
}) {
  const imageURL = getImageAbsoluteURL(getProjectLogoUrl(project, 100, "dark"));
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

export function TagIcon({ size = "1.5em" }) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      stroke-width="0"
      viewBox="0 0 15 16"
      height={size}
      width={size}
    >
      <path
        fill-rule="evenodd"
        d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 0 0 0-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"
      ></path>
    </svg>
  );
}
