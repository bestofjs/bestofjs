"use cache";

import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

import { getHotProjects } from "@/app/(home)/hot-projects";
import { HotProjectList } from "@/components/home/hot-project-list";

export default async function WeeklyTrendsPage() {
  cacheLife("daily");
  cacheTag("daily", "home");

  const projects = await getHotProjects("weekly");
  return <HotProjectList projects={projects} sortOptionKey="weekly" />;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Trends last 7 days",
  };
}
