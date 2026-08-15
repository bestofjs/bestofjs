import { cacheLife, cacheTag } from "next/cache";

import { findTagWithProjects } from "@/app/db";

type Context = { params: Promise<{ slug: string }> };
export async function GET(_req: Request, props: Context) {
  const { slug } = await props.params;

  const tag = await getTagData(slug);
  if (!tag) {
    return new Response(JSON.stringify({ error: `Tag not found: ${slug}` }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(JSON.stringify(tag), {
    status: 200,
    headers: {
      "content-type": "application/json",
      // No `Cache-Control` on purpose: caching is handled at the Next.js level
      // by `getTagData()`'s `"use cache"` below. The route itself stays dynamic,
      // so Next already sends `no-store` — and an `s-maxage` would put the
      // response in Vercel's edge cache, which `revalidateTag()` does not clear,
      // outliving and defeating `/api/revalidate?tag=tags`.
    },
  });
}

async function getTagData(slug: string) {
  "use cache";
  cacheLife("days");
  cacheTag("tags"); // same tag as /tags, so one revalidation clears both

  return await findTagWithProjects(slug);
}
