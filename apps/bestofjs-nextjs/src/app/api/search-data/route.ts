import { api } from "@/server/api-remote-json";

export const runtime = "edge";

export async function GET() {
  const projects = await api.projects.getSearchIndex();
  const { tags } = await api.tags.findTags({
    sort: { counter: -1 },
    limit: 0, // grab all tags
  });

  const output = { projects, tags };

  return new Response(JSON.stringify(output), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}
