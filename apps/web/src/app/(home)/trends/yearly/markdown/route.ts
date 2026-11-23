import { getHotProjects } from "@/app/(home)/hot-projects";
import { currentApp } from "@/config/apps";
import { projectList } from "@/server/markdown/format";
import { markdownResponse } from "@/server/markdown/response";
export async function GET() {
  const projects = await getHotProjects("yearly", currentApp);
  return markdownResponse(
    `# yearly trends

${projectList(projects)}`,
    "/trends/yearly",
  );
}
