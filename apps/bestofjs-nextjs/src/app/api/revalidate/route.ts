import { revalidateTag } from "next/cache";

export const runtime = "edge";

// API end-point to be called when we need to purge the cache for a given tag
// without having to wait the delay of 24 hours set via fetch `revalidate` option
// Doc: https://nextjs.org/docs/app/building-your-application/caching
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");
    if (!tag) throw new Error("Provide `tag` parameter");
    revalidateTag(tag);
    const output = { status: "No error!", tag };

    return new Response(JSON.stringify(output), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error) {
    const output = { status: "error", message: (error as Error).message };
    return new Response(JSON.stringify(output), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    });
  }
}
