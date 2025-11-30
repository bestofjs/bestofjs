"use cache";

import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

import { getHotProjectsRequest } from "@/app/backend-search-requests";
import { HotProjectList } from "@/components/home/hot-project-list";
import { api } from "@/server/api-local-json";

export default async function DailyTrendsPage() {
  cacheLife("daily");
  cacheTag("daily", "home");

  const { projects } = await api.projects.findProjects(
    getHotProjectsRequest(5, "daily"),
  );
  return <HotProjectList projects={projects} sortOptionKey="daily" />;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Trends today",
  };
}
