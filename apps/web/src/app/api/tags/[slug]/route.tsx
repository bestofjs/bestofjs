import { cacheLife } from "next/cache";

import { findTagWithProjects } from "@/app/db";
import { currentApp, excludedTagCodes, type WebApp } from "@/config/apps";
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

  // A tag this deployment hides is never linked from a listing, so a request
  // for one by code can only come from a project page's raw tag chips — and
  // those pages stay reachable by design. Answering with the tag beats a 404
  // rendering as an error in the hover card. Listings are unaffected: they
  // never emit a link to a hidden tag, and hover cards for *visible* tags keep
  // the deployment's filtering (their counts and top projects stay curated).
  const showExcludedTags = excludedTagCodes.includes(slug);

  return await findTagWithProjects(slug, { showExcludedTags });
}
