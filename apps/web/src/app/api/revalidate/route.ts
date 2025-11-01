import { revalidatePath, updateTag } from "next/cache";

// API end-point to be called when we need to purge the cache for a given tag or path
// Doc: https://nextjs.org/docs/app/building-your-application/caching
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");
    const path = searchParams.get("path");

    if (tag) {
      updateTag(tag);
      return sendResponse({ tag });
    }

    if (path) {
      revalidatePath(path);
      return sendResponse({ path });
    }

    throw new Error("Provide `tag` or `path` parameter to invalidate cache");
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

function sendResponse(data: { tag?: string; path?: string }) {
  return new Response(
    JSON.stringify({ message: "Revalidate request sent, no error", ...data }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    },
  );
}
