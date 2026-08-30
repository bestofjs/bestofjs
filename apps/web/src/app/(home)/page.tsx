import type { Metadata } from "next";
import { cacheLife } from "next/cache";

import { HotProjectList } from "@/components/home/hot-project-list";
import { currentApp, type WebApp } from "@/config/apps";
import { cacheTagForApp } from "@/server/cache";

import { getHotProjects } from "./hot-projects";

export default async function DailyTrendsPage() {
  return renderDailyTrendsPage(currentApp);
}

// A page component can't take extra arguments, so the cached rendering is
// split into this inner function: `app` needs to be a real parameter (not a
// module-scope import) since Next's "use cache" excludes module-scope values
// from the cache key (github.com/vercel/next.js#74498).
async function renderDailyTrendsPage(app: WebApp) {
  "use cache";
  cacheLife("daily");
  cacheTagForApp(app, "daily", "home");

  const projects = await getHotProjects("daily", app);
  return <HotProjectList projects={projects} sortOptionKey="daily" />;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Trends today",
  };
}
