import { Metadata } from "next";

import { getHotProjectsRequest } from "@/app/backend-search-requests";
import { HotProjectList } from "@/components/home/hot-project-list";
import { api } from "@/server/api-local-json";

export default async function MonthlyTrendsPage() {
  const { projects } = await api.projects.findProjects(
    getHotProjectsRequest(5, "monthly")
  );
  return <HotProjectList projects={projects} sortOptionKey="monthly" />;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Trends last 30 days",
  };
}
