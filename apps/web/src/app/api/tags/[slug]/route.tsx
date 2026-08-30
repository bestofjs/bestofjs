import { cacheLife } from "next/cache";

import { findTagWithProjects } from "@/app/db";
import { currentApp, type WebApp } from "@/config/apps";
import { cacheTagForApp } from "@/server/cache";

type Context = { params: Promise<{ slug: string }> };
export async function GET(_req: Request, props: Context) {
  const { slug } = await props.params;

  const tag = await getTagData(slug, currentApp);
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

async function getTagData(slug: string, app: WebApp) {
  "use cache";
  cacheLife("days");
  cacheTagForApp(app, "tags"); // same tag as /tags, so one revalidation clears both

  return await findTagWithProjects(slug);
}
