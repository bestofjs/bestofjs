import { cacheLife } from "next/cache";

import type { WebApp } from "@/config/apps";
import { api } from "@/server/api";
import type { MonthlyDate } from "@/server/api-rankings";
import { cacheTagForApp } from "@/server/cache";

export async function getLatestMonthlyRankings(app: WebApp, limit = 5) {
  "use cache";
  cacheLife("monthly");
  cacheTagForApp(app, "monthly", "latest", "projects");
  const data = await api.rankings.getMonthlyRankings({ limit });
  if (!data) throw new Error("Latest monthly rankings are missing");
  return data;
}

export async function getCachedMonthlyRankings(
  date: MonthlyDate,
  limit: number,
  app: WebApp,
) {
  "use cache";
  cacheTagForApp(app, "monthly", `${date.year}-${date.month}`, "projects");
  const data = await api.rankings.getMonthlyRankings({ date, limit });
  // A recent archive may not have been published yet.
  if (data) cacheLife("forever");
  else cacheLife("minutes");
  return data;
}
