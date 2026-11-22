import { currentApp } from "@/config/apps";
import { projectList } from "@/server/markdown/format";
import { markdownNotFound, markdownResponse } from "@/server/markdown/response";

import { getCachedMonthlyRankings } from "../../../page-data";
export async function GET(
  _request: Request,
  context: RouteContext<"/rankings/monthly/[year]/[month]/markdown">,
) {
  const params = await context.params;
  const year = Number(params.year),
    month = Number(params.month);
  if (
    !Number.isInteger(year) ||
    year < 2016 ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12 ||
    new Date(year, month - 1) >=
      new Date(new Date().getFullYear(), new Date().getMonth())
  )
    return markdownNotFound();
  const data = await getCachedMonthlyRankings({ year, month }, 50, currentApp);
  if (!data) return markdownNotFound();

  const previous = month === 1 ? `${year - 1}/12` : `${year}/${month - 1}`;
  const next = month === 12 ? `${year + 1}/1` : `${year}/${month + 1}`;
  return markdownResponse(
    `# Monthly rankings: ${year}-${String(month).padStart(2, "0")}

Ranked by GitHub stars added during the month.

${projectList(data.projects)}

${data.isFirst ? "" : `[Previous month](/rankings/monthly/${previous}.md)`}
${data.isLatest ? "" : `[Next month](/rankings/monthly/${next}.md)`}`,
    `/rankings/monthly/${year}/${month}`,
  );
}
