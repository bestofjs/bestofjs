import { currentApp } from "@/config/apps";
import {
  projectList,
  publicQuery,
  searchParams,
  text,
} from "@/server/markdown/format";
import { markdownResponse } from "@/server/markdown/response";
import { markdownURL } from "@/server/markdown/urls";

import { fetchFeaturedProjects, searchStateParser } from "../page-data";
export async function GET(request: Request) {
  const { searchState, buildPageURL } = searchStateParser.parse(
    searchParams(request),
  );
  const data = await fetchFeaturedProjects(searchState, currentApp);
  const { page, limit } = searchState;
  return markdownResponse(
    `# Featured Projects

${data.total} projects. Page ${page}. Sort: ${text(searchState.sort)}. Scope: ${"all"}.
An editorial selection by the Best of JS team.

${projectList(data.projects)}

${page > 1 ? `[Previous page](${markdownURL(buildPageURL((state) => ({ ...state, page: page - 1 })))})` : ""}
${page * limit < data.total ? `[Next page](${markdownURL(buildPageURL((state) => ({ ...state, page: page + 1 })))})` : ""}`,
    "/featured" + publicQuery(request),
  );
}
