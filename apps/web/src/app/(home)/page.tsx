import type { Metadata } from "next";
import { cacheLife } from "next/cache";

import { HotProjectList } from "@/components/home/hot-project-list";
import { currentApp, isMainApp, type WebApp } from "@/config/apps";
import { cacheTagForApp } from "@/server/cache";
import { markdownMetadata } from "@/server/markdown/metadata";

import { getHotProjects } from "./hot-projects";

export default async function DailyTrendsPage() {
  return renderDailyTrendsPage(currentApp);
}

// A page component can't take extra arguments, so the cached rendering is
// split into this inner function: `app` needs to be a real parameter (not a
// module-scope import) since Next's "use cache" excludes module-scope values
// from the cache key (github.com/vercel/next.js#74498).
async function renderDailyTrendsPage(app: WebApp) {
  "use cache";
  cacheLife("daily");
  cacheTagForApp(app, "daily", "home");

  const projects = await getHotProjects("daily", app);
  return (
    <>
      {app === "main" && (
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Static JSON-LD identity; escape less-than characters.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://bestofjs.org/#website",
                  name: "Best of JS",
                  alternateName: "Best of JavaScript",
                  url: "https://bestofjs.org",
                  description:
                    "A curated catalog of JavaScript and web-platform projects, providing discovery and trend information based on GitHub data.",
                  publisher: { "@id": "https://bestofjs.org/#organization" },
                },
                {
                  "@type": "Organization",
                  "@id": "https://bestofjs.org/#organization",
                  name: "Best of JS",
                  url: "https://bestofjs.org",
                  logo: "https://bestofjs.org/logo.png",
                  sameAs: ["https://github.com/bestofjs"],
                },
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <HotProjectList projects={projects} sortOptionKey="daily" />
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Trends today",
    ...markdownMetadata("/"),
    ...(isMainApp
      ? {
          openGraph: {
            type: "website" as const,
            url: "https://bestofjs.org",
            images: ["/images/og-home-2025-04-27.png"],
          },
        }
      : {}),
  };
}
