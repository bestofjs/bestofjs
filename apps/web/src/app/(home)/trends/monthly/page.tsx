import { Suspense } from "react";
import type { Metadata } from "next";

import { getHotProjectsRequest } from "@/app/backend-search-requests";
import { HotProjectList } from "@/components/home/hot-project-list";
import { api } from "@/server/api-local-json";

export default async function MonthlyTrendsPage() {
  const { projects } = await api.projects.findProjects(
    getHotProjectsRequest(5, "monthly"),
  );
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HotProjectList projects={projects} sortOptionKey="monthly" />
    </Suspense>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Trends last 30 days",
  };
}
