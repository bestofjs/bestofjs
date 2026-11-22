import { APP_CANONICAL_URL } from "@/config/site";
export function markdownResponse(
  body: string,
  publicPath: string,
  status = 200,
) {
  return new Response(`${body.trim()}\n`, {
    status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "private, no-store",
      Vary: "Accept",
      ...(status === 200
        ? {
            Link: `<${new URL(publicPath, APP_CANONICAL_URL)}>; rel="canonical"`,
          }
        : {}),
      "X-Content-Type-Options": "nosniff",
    },
  });
}
export function markdownNotFound() {
  return markdownResponse(
    `# Page not found

This Markdown page or resource is unavailable.

- [Home](/index.md)
- [Projects](/projects.md)
- [Sitemap](/sitemap.xml)
- [Agent guidance](/llms.txt)`,
    "/",
    404,
  );
}
