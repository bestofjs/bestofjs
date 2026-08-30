import type { Metadata } from "next";
import { cacheLife } from "next/cache";

import { getHotProjects } from "@/app/(home)/hot-projects";
import { HotProjectList } from "@/components/home/hot-project-list";
import { currentApp, type WebApp } from "@/config/apps";
import { cacheTagForApp } from "@/server/cache";

export default async function MonthlyTrendsPage() {
  return renderMonthlyTrendsPage(currentApp);
}

// See `(home)/page.tsx` for why this is split: `app` must be a real
// parameter, since Next's "use cache" excludes module-scope values from the
// cache key (github.com/vercel/next.js#74498).
async function renderMonthlyTrendsPage(app: WebApp) {
  "use cache";
  cacheLife("daily");
  cacheTagForApp(app, "daily", "home");

  const projects = await getHotProjects("monthly", app);
  return <HotProjectList projects={projects} sortOptionKey="monthly" />;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Trends last 30 days",
  };
}
