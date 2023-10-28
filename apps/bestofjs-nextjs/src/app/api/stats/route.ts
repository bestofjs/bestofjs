import { api } from "@/server/api-remote-json";

export const runtime = "edge";

// This end-point is used to check the freshness of the static API data
// that is supposed to be revalidated every day
export async function GET() {
  const stats = await api.projects.getStats();
  const now = Date.now();
  const timeDiff =
    (now - new Date(stats.lastUpdateDate).getTime()) / (1000 * 60 * 60);

  const output = { ...stats, relativeTime: timeDiff.toFixed(1) + " hours ago" };

  return new Response(JSON.stringify(output), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "Cache-Control": "max-age=0", // we don't want to cache this response
    },
  });
}
