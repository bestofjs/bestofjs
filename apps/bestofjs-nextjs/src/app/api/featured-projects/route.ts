import { searchClient } from "@/app/backend";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const skipParam = searchParams.get("skip");
  const limitParam = searchParams.get("limit");
  const skip = skipParam ? parseInt(skipParam) : 0;
  const limit = limitParam ? parseInt(limitParam) : 0;
  const output = await searchClient.findRandomFeaturedProjects({ skip, limit });

  return new Response(JSON.stringify(output), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}
