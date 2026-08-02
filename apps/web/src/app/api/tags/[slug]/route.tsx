import { cacheLife, cacheTag } from "next/cache";

import { findTagWithProjects } from "@repo/db/tags";

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
      // No CDN `Cache-Control` on purpose: `revalidateTag()` clears the Next
      // cache below but not Vercel's edge cache, so an `s-maxage` would outlive
      // — and defeat — `/api/revalidate?tag=tags`.
    },
  });
}

async function getTagData(slug: string) {
  "use cache";
  cacheLife("days");
  cacheTag("tags"); // same tag as /tags, so one revalidation clears both

  return await findTagWithProjects(slug);
}
