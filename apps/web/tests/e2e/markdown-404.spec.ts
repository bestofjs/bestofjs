import { expect, test } from "@playwright/test";

test("serves a Markdown 404 only when requested for an unmatched URL", async ({
  request,
}) => {
  const missingPath = "/__markdown-404-probe";
  const markdown = await request.get(missingPath, {
    headers: { Accept: "text/markdown" },
  });
  expect(markdown.status()).toBe(404);
  expect(markdown.headers()["content-type"]).toContain("text/markdown");
  expect(await markdown.text()).toMatch(/^# Page not found/);

  const html = await request.get(missingPath, {
    headers: { Accept: "text/html" },
  });
  expect(html.status()).toBe(404);
  expect(html.headers()["content-type"]).toContain("text/html");

  const asset = await request.get("/logo.png", {
    headers: { Accept: "text/markdown" },
  });
  expect(asset.status()).toBe(200);
  expect(asset.headers()["content-type"]).toContain("image/png");
});
