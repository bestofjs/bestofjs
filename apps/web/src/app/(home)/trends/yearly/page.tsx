import type { Metadata } from "next";

import { getHotProjectsRequest } from "@/app/backend-search-requests";
import { HotProjectList } from "@/components/home/hot-project-list";
import { api } from "@/server/api-local-json";

export default async function YearlyTrendsPage() {
  const { projects } = await api.projects.findProjects(
    getHotProjectsRequest(5, "yearly"),
  );
  return <HotProjectList projects={projects} sortOptionKey="yearly" />;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Trends last 12 months",
  };
}
