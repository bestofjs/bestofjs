import { z } from "zod";

import { findRandomFeaturedProjects } from "@/server/featured-projects";

const featuredProjectsQuerySchema = z.object({
  skip: z.coerce.number().int().min(0),
  limit: z.coerce.number().int().min(1).max(100),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = parseFeaturedProjectsQuery(searchParams);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid query parameters" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const { skip, limit } = parsed.data;
  const output = await findRandomFeaturedProjects({ skip, limit });

  return new Response(JSON.stringify(output), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}

function parseFeaturedProjectsQuery(searchParams: URLSearchParams) {
  return featuredProjectsQuerySchema.safeParse({
    skip: searchParams.get("skip") || 0,
    limit: searchParams.get("limit") || 5,
  });
}
