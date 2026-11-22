import { getHotProjects } from "@/app/(home)/hot-projects";
import { getHomeData } from "@/app/(home)/page-data";
import { getLatestMonthlyRankings } from "@/app/rankings/monthly/page-data";
import { currentApp } from "@/config/apps";
import { link, projectList } from "@/server/markdown/format";
import { markdownResponse } from "@/server/markdown/response";
export async function GET() {
  const [hot, home, monthly] = await Promise.all([
    getHotProjects("daily", currentApp),
    getHomeData(currentApp),
    getLatestMonthlyRankings(currentApp),
  ]);
  return markdownResponse(
    `# Best of JS

A curated catalog of JavaScript and web-platform projects. Discover projects, browse categories, and compare popularity trends based on GitHub stars. Stars indicate popularity, not quality, security, or suitability.

## Daily trends

${projectList(hot)}

## Newest projects

${projectList(home.newestProjects)}

## Popular tags

${home.popularTags.map((tag) => `- ${link(tag.name, `/projects.md?tags=${tag.code}`)}: ${tag.counter} projects`).join("\n")}

## Catalog statistics

${home.total} projects; ${home.activeTotal} active projects. Last updated: ${home.lastUpdateDate?.toISOString() ?? "unavailable"}.

## Latest monthly ranking: ${monthly.year}-${String(monthly.month).padStart(2, "0")}

${projectList(monthly.projects)}

${link("Full monthly ranking", `/rankings/monthly/${monthly.year}/${monthly.month}.md`)}

## Explore

[Projects](/projects.md) · [Tags](/tags.md) · [Featured](/featured.md) · [Hall of Fame](/hall-of-fame.md) · [About](/about.md) · [Privacy](/privacy.md)`,
    "/",
  );
}
