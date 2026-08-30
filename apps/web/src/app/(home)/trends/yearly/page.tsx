import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

import { getHotProjects } from "@/app/(home)/hot-projects";
import { HotProjectList } from "@/components/home/hot-project-list";
import { currentApp, type WebApp } from "@/config/apps";

export default async function YearlyTrendsPage() {
  return renderYearlyTrendsPage(currentApp);
}

// See `(home)/page.tsx` for why this is split: `app` must be a real
// parameter, since Next's "use cache" excludes module-scope values from the
// cache key (github.com/vercel/next.js#74498).
async function renderYearlyTrendsPage(app: WebApp) {
  "use cache";
  cacheLife("daily");
  cacheTag("daily", "home", app);

  const projects = await getHotProjects("yearly", app);
  return <HotProjectList projects={projects} sortOptionKey="yearly" />;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Trends last 12 months",
  };
}
