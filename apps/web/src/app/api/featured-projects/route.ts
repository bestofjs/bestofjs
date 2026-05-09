import { api } from "@/server/api-remote-json";
import { findRandomFeaturedProjects } from "@/server/featured-projects";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const skipParam = searchParams.get("skip");
  const limitParam = searchParams.get("limit");
  const skip = skipParam ? parseInt(skipParam) : 0;
  const limit = limitParam ? parseInt(limitParam) : 0;
  const output = await findRandomFeaturedProjects(
    api.projects.getProjectBySlug,
    { skip, limit },
  );

  return new Response(JSON.stringify(output), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}
