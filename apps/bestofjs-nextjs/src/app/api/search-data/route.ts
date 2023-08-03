import { searchClient } from "@/app/backend";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const projects = await searchClient.getSearchIndex();
  const { tags } = await searchClient.findTags({
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
