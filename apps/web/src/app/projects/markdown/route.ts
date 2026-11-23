import { currentApp } from "@/config/apps";
import {
  projectList,
  publicQuery,
  searchParams,
  text,
} from "@/server/markdown/format";
import { markdownResponse } from "@/server/markdown/response";
import { markdownURL } from "@/server/markdown/urls";

import { fetchPageData } from "../page-data";
import { TrendsProjectSearchStateParser } from "../trends-project-search-state";
export async function GET(request: Request) {
  const { searchState, buildPageURL } =
    new TrendsProjectSearchStateParser().parse(searchParams(request));
  const data = await fetchPageData(searchState, currentApp);
  const { page, limit } = searchState;
  return markdownResponse(
    `# Projects

${data.total} projects. Page ${page}. Sort: ${text(searchState.sort)}. Scope: ${text(searchState.query ? "all" : searchState.scope)}.
Query: ${text(searchState.query ?? "")} Tags: ${data.selectedTags.map((tag) => text(tag.name)).join(", ")}

${projectList(data.projects)}

${page > 1 ? `[Previous page](${markdownURL(buildPageURL((state) => ({ ...state, page: page - 1 })))})` : ""}
${page * limit < data.total ? `[Next page](${markdownURL(buildPageURL((state) => ({ ...state, page: page + 1 })))})` : ""}`,
    "/projects" + publicQuery(request),
  );
}
