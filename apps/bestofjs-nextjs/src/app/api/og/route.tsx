import { ImageResponse } from "next/server";

import { searchClient } from "@/app/backend";
import { getHotProjectsRequest } from "@/app/backend-search-requests";

import { Box, ImageLayout } from "./og-utils";

export const runtime = "edge";

export async function GET() {
  const { projects } = await searchClient.findProjects(getHotProjectsRequest());

  return new ImageResponse(
    (
      <ImageLayout>
        <div style={{ display: "flex", gap: 16 }}>
          <div>Hottest project today</div>
          <div style={{ color: "#a1a1aa" }}>
            {"(" + formatDate(new Date()) + ")"}
          </div>
        </div>
        <Box style={{ flexDirection: "column", gap: 8 }}>
          {projects.slice(0, 3).map((project, index) => (
            <ProjectRow project={project} rank={index + 1} />
          ))}
        </Box>
      </ImageLayout>
    ),
    {
      width: 1280,
      height: 640,
    }
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
    <div style={{ color: "white", display: "flex", gap: 24 }}>
      <Box style={{ color: "#a1a1aa" }}>#{rank}</Box>
      <div>{project.name}</div>
      <div style={{ display: "flex" }}>
        <ShowStars project={project} />
      </div>
    </div>
  );
}

function ShowStars({ project }: { project: BestOfJS.Project }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        color: "#a1a1aa",
      }}
    >
      <div style={{ display: "flex" }}>{`+${project.trends.daily}`}</div>
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

function Footer() {
  return (
    <div
      style={{
        height: 8,
        width: "100%",
        position: "absolute",
        bottom: 0,
        backgroundImage:
          "linear-gradient(135deg, #ffe38c 20%, #ffae63 40%, #f76d42, #d63c4a, #9c0042)",
      }}
    ></div>
  );
}

function formatDate(date: Date) {
  return date.toJSON().slice(0, 10);
}
