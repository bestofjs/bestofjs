import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

const app = vi.hoisted(() => ({ isMainApp: true }));
vi.mock("@/config/apps", () => app);

import { proxy } from "@/proxy";

import { prefersMarkdown } from "./accept";
import { link, searchParams, text } from "./format";
import { markdownResponse } from "./response";
import { githubReadmeURL, markdownURL } from "./urls";

describe("Accept negotiation", () => {
  it.each([
    [null, false],
    ["*/*", false],
    ["text/html,application/xhtml+xml,*/*;q=0.8", false],
    ["text/markdown", true],
    ["text/markdown;q=0", false],
    ["text/markdown;q=.5,text/html;q=.8", false],
    ["text/markdown;q=.8,text/html;q=.5", true],
    ["text/markdown;q=0,text/*;q=1", false],
    ["TEXT/MARKDOWN;Q=1,text/html;q=.5", true],
    ["text/markdown;q=bogus", false],
    ["text/markdown;q=2", false],
    ["text/markdown;q=.5,*/*;q=.8", false],
  ])("%s → %s", (accept, expected) =>
    expect(prefersMarkdown(accept)).toBe(expected),
  );
});
describe("public routing", () => {
  const request = (path: string, headers: Record<string, string> = {}) =>
    new NextRequest(`https://bestofjs.org${path}`, { headers });
  it("rewrites home and suffix URLs, retaining repeated query parameters", () => {
    expect(
      proxy(request("/", { accept: "text/markdown" })).headers.get(
        "x-middleware-rewrite",
      ),
    ).toBe("https://bestofjs.org/markdown");
    expect(
      proxy(request("/projects.md?tags=react&tags=vue&page=2")).headers.get(
        "x-middleware-rewrite",
      ),
    ).toBe("https://bestofjs.org/projects/markdown?tags=react&tags=vue&page=2");
  });
  it("returns Markdown 404 for unknown suffix and direct internal routes", () => {
    for (const path of [
      "/missing.md",
      "/markdown",
      "/%6darkdown",
      "/projects/react/markdown",
      "/projects/%6darkdown",
      "/%ZZ/%6darkdown",
    ]) {
      const response = proxy(request(path));
      expect(response.status).toBe(404);
      expect(response.headers.get("content-type")).toContain("text/markdown");
    }
  });
  it("leaves unsupported HTML, assets, and ordinary browsers alone", () => {
    for (const path of ["/missing", "/logo.png"])
      expect(
        proxy(request(path, { accept: "text/markdown" })).headers.has(
          "x-middleware-rewrite",
        ),
      ).toBe(false);
    expect(
      proxy(request("/projects", { accept: "text/html" })).headers.get("vary"),
    ).toContain("Accept");
  });
  it.each<Record<string, string>>([
    { rsc: "1" },
    { "next-router-prefetch": "1" },
    { purpose: "prefetch" },
    { "next-router-state-tree": "[]" },
  ])("preserves internal navigation %s", (headers) => {
    expect(
      proxy(
        request("/projects", { accept: "text/markdown", ...headers }),
      ).headers.has("x-middleware-rewrite"),
    ).toBe(false);
  });
  it("disables the agent endpoints on No AI", () => {
    app.isMainApp = false;
    try {
      for (const path of [
        "/index.md",
        "/llms.txt",
        "/llms%2etxt",
        "/markdown",
        "/projects/markdown",
        "/projects/%6darkdown",
      ]) {
        const response = proxy(request(path));
        expect(response.status).toBe(404);
        expect(response.headers.get("content-type")).toBeNull();
      }
      expect(
        proxy(request("/", { accept: "text/markdown" })).headers.has(
          "x-middleware-rewrite",
        ),
      ).toBe(false);
    } finally {
      app.isMainApp = true;
    }
  });
});
describe("representation helpers", () => {
  it("keeps URL state", () => {
    expect(markdownURL("/?tags=react&tags=vue#top")).toBe(
      "/index.md?tags=react&tags=vue#top",
    );
    expect(markdownURL("https://bestofjs.org/projects/react?scope=all")).toBe(
      "https://bestofjs.org/projects/react.md?scope=all",
    );
    expect(markdownURL("/projects.md?page=2")).toBe("/projects.md?page=2");
    expect(
      searchParams(
        new Request("https://bestofjs.org/projects?tags=react&tags=vue"),
      ),
    ).toEqual({ tags: ["react", "vue"] });
  });
  it("sets canonical links without caching full responses", () => {
    const response = markdownResponse("# Projects", "/projects?tags=react");
    expect(response.headers.get("link")).toBe(
      '<https://bestofjs.org/projects?tags=react>; rel="canonical"',
    );
    expect(response.headers.get("cache-control")).toContain("no-store");
  });
  it("escapes untrusted catalog text", () => {
    expect(text("<script>\n[x]")).toBe("\\<script\\> \\[x\\]");
    expect(link("x", "https://example.com/a(b)")).toContain("a%28b%29");
  });
  it("links to monorepo package READMEs when packagePath is set", () => {
    expect(githubReadmeURL("facebook/react", "main", null)).toBe(
      "https://github.com/facebook/react#readme",
    );
    expect(githubReadmeURL("facebook/react", "main", "   ")).toBe(
      "https://github.com/facebook/react#readme",
    );
    expect(
      githubReadmeURL("facebook/react", "canary", "/packages/react/"),
    ).toBe(
      "https://github.com/facebook/react/tree/canary/packages/react#readme",
    );
    expect(githubReadmeURL("owner/repo", null, "packages/core")).toBe(
      "https://github.com/owner/repo/tree/main/packages/core#readme",
    );
  });
});
