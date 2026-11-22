import { type NextRequest, NextResponse } from "next/server";

import { isMainApp } from "@/config/apps";
import {
  MARKDOWN_FALLBACK_HEADER,
  prefersMarkdown,
} from "@/server/markdown/accept";
import { markdownNotFound } from "@/server/markdown/response";
import { markdownURL } from "@/server/markdown/urls";

// The only supported-route table. Next.js resolves typed route parameters.
const markdownPages = [
  /^\/$/,
  /^\/projects$/,
  /^\/projects\/[^/]+$/,
  /^\/tags$/,
  /^\/tags\/[^/]+$/,
  /^\/rankings\/monthly$/,
  /^\/rankings\/monthly\/\d{4}\/\d{1,2}$/,
  /^\/featured$/,
  /^\/hall-of-fame(?:\/search)?$/,
  /^\/(?:about|privacy)$/,
  /^\/trends\/(?:weekly|monthly|yearly)$/,
];
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/\/$/, "") || "/";
  if (path.split("/").includes("markdown")) return markdownNotFound();
  const explicit = path.endsWith(".md");
  if (!isMainApp) {
    if (explicit || path === "/llms.txt")
      return new NextResponse(null, { status: 404 });
    return continueRouting(request);
  }
  if (!["GET", "HEAD"].includes(request.method))
    return continueRouting(request);
  const publicPath =
    path === "/index.md" ? "/" : explicit ? path.slice(0, -3) : path;
  const internal =
    request.headers.has("rsc") ||
    request.headers.has("next-router-state-tree") ||
    request.headers.has("next-router-prefetch") ||
    request.headers.get("purpose") === "prefetch" ||
    request.nextUrl.searchParams.has("_rsc");
  const markdown =
    explicit || (!internal && prefersMarkdown(request.headers.get("accept")));
  const supported = markdownPages.some((pattern) => pattern.test(publicPath));
  if (!supported)
    return explicit ? markdownNotFound() : continueRouting(request, markdown);

  const url = request.nextUrl.clone();
  let response: NextResponse;
  if (markdown) {
    url.pathname = publicPath === "/" ? "/markdown" : `${publicPath}/markdown`;
    response = NextResponse.rewrite(url);
    response.headers.set("Cache-Control", "private, no-store");
  } else {
    response = continueRouting(request);
    response.headers.append(
      "Link",
      `<${markdownURL(publicPath + url.search)}>; rel="alternate"; type="text/markdown"`,
    );
  }
  response.headers.append("Vary", "Accept");
  return response;
}

function continueRouting(request: NextRequest, markdownFallback = false) {
  if (!markdownFallback && !request.headers.has(MARKDOWN_FALLBACK_HEADER)) {
    return NextResponse.next();
  }
  const headers = new Headers(request.headers);
  // Only the proxy can opt a request into the fallback rewrite.
  if (markdownFallback) headers.set(MARKDOWN_FALLBACK_HEADER, "1");
  else headers.delete(MARKDOWN_FALLBACK_HEADER);
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/((?!_next/|api/|favicon.ico).*)"] };
