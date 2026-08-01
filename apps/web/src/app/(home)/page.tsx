"use cache";

import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

import { HotProjectList } from "@/components/home/hot-project-list";

import { getHotProjects } from "./hot-projects";

export default async function DailyTrendsPage() {
  cacheLife("daily");
  cacheTag("daily", "home");

  const projects = await getHotProjects("daily");
  return <HotProjectList projects={projects} sortOptionKey="daily" />;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Trends today",
  };
}
