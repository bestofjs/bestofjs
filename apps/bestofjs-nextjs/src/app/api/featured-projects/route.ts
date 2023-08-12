// import { setTimeout } from "node:timers/promises";

import { searchClient } from "@/app/backend";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offsetParam = searchParams.get("offset");
  const offsetNumber = offsetParam ? parseInt(offsetParam) : 0;
  const output = await searchClient.findRandomFeaturedProjects(
    offsetNumber,
    offsetNumber + 5
  );

  // await setTimeout(2000);

  return new Response(JSON.stringify(output), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}
