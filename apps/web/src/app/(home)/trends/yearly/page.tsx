"use cache";

import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

import { getHotProjects } from "@/app/(home)/hot-projects";
import { HotProjectList } from "@/components/home/hot-project-list";

export default async function YearlyTrendsPage() {
  cacheLife("daily");
  cacheTag("daily", "home");

  const projects = await getHotProjects("yearly");
  return <HotProjectList projects={projects} sortOptionKey="yearly" />;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Trends last 12 months",
  };
}
