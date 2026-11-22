import { getHotProjects } from "@/app/(home)/hot-projects";
import { currentApp } from "@/config/apps";
import { projectList } from "@/server/markdown/format";
import { markdownResponse } from "@/server/markdown/response";
export async function GET() {
  const projects = await getHotProjects("monthly", currentApp);
  return markdownResponse(
    `# monthly trends

${projectList(projects)}`,
    "/trends/monthly",
  );
}
