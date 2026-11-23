import { link, searchParams, text } from "@/server/markdown/format";
import { markdownResponse } from "@/server/markdown/response";
import { markdownURL } from "@/server/markdown/urls";

import { getMembers } from "../page-data";
import { HallOfFameSearchStateParser } from "../search/hall-of-fame-search-state";
export async function GET(request: Request) {
  const isSearch = new URL(request.url).pathname.includes("/search/");
  const { searchState, buildPageURL } = new HallOfFameSearchStateParser().parse(
    isSearch ? searchParams(request) : {},
  );
  const { members, total } = await getMembers(searchState);
  const { page, limit } = searchState;
  return markdownResponse(
    `# JavaScript Hall of Fame

${total} members. Page ${page}.

${members
  .map(
    (
      member,
    ) => `- ${link(member.name || member.username, `https://github.com/${member.username}`)}: ${text(member.bio)}
  Projects: ${member.projects.map((project) => link(project.name, `/projects/${project.slug}.md`)).join(", ")}`,
  )
  .join("\n\n")}

${page > 1 ? link("Previous page", markdownURL(buildPageURL((s) => ({ ...s, page: page - 1 })))) : ""}
${page * limit < total ? link("Next page", markdownURL(buildPageURL((s) => ({ ...s, page: page + 1 })))) : ""}`,
    isSearch
      ? "/hall-of-fame/search" + new URL(request.url).search
      : "/hall-of-fame",
  );
}
