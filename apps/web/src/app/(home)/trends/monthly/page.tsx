"use cache";

import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

import { getHotProjects } from "@/app/(home)/hot-projects";
import { HotProjectList } from "@/components/home/hot-project-list";

export default async function MonthlyTrendsPage() {
  cacheLife("daily");
  cacheTag("daily", "home");

  const projects = await getHotProjects("monthly");
  return <HotProjectList projects={projects} sortOptionKey="monthly" />;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Trends last 30 days",
  };
}
