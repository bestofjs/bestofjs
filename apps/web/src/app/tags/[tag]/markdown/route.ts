import { NextResponse } from "next/server";
export async function GET(
  request: Request,
  context: RouteContext<"/tags/[tag]/markdown">,
) {
  const { tag } = await context.params;
  const url = new URL(request.url);
  url.pathname = "/projects.md";
  url.searchParams.set("tags", tag);
  return NextResponse.redirect(url, 307);
}
