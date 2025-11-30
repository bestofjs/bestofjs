"use cache";

import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

import { getHotProjectsRequest } from "@/app/backend-search-requests";
import { HotProjectList } from "@/components/home/hot-project-list";
import { api } from "@/server/api-local-json";

export default async function WeeklyTrendsPage() {
  cacheLife("daily");
  cacheTag("daily", "home");

  const { projects } = await api.projects.findProjects(
    getHotProjectsRequest(5, "weekly"),
  );
  return <HotProjectList projects={projects} sortOptionKey="weekly" />;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Trends last 7 days",
  };
}
