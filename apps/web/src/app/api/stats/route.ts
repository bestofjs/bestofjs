import { db } from "@repo/db";
import { getProjectsStats } from "@repo/db/projects";

// This end-point is used to check the freshness of the data the app renders:
// how many projects are tracked, and when the daily trends pipeline last wrote.
// Deliberately NOT cached (no `"use cache"`): a freshness probe that reads a
// cache would report the cache's age, not the data's.
export async function GET() {
  const { total, activeTotal, lastUpdateDate } = await getProjectsStats({ db });

  const output = {
    total,
    activeTotal,
    lastUpdateDate,
    // `null` rather than "NaN hours ago" when both trend tables are empty — a
    // fresh local database or a preview branch, never production, where
    // `updated_at` is NOT NULL in both.
    relativeTime: lastUpdateDate ? formatRelativeTime(lastUpdateDate) : null,
  };

  return new Response(JSON.stringify(output), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "Cache-Control": "max-age=0", // we don't want to cache this response
    },
  });
}

function formatRelativeTime(date: Date) {
  const hours = (Date.now() - date.getTime()) / (1000 * 60 * 60);
  return `${hours.toFixed(1)} hours ago`;
}
