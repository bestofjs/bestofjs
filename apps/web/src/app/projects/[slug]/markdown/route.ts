import {
  getProjectDescription,
  getProjectTrends,
  getProjectURL,
} from "@repo/core/services/projects";

import { link, text } from "@/server/markdown/format";
import { markdownNotFound, markdownResponse } from "@/server/markdown/response";
import { githubReadmeURL } from "@/server/markdown/urls";

import { getProjectDetailsData } from "../page-data";
export async function GET(
  _request: Request,
  context: RouteContext<"/projects/[slug]/markdown">,
) {
  const { slug } = await context.params;
  const project = await getProjectDetailsData(slug);
  if (!project) return markdownNotFound();
  const repository = `https://github.com/${project.repo.full_name}`;
  const website = getProjectURL(project);
  return markdownResponse(
    `# ${text(project.name)}

${text(getProjectDescription(project))}

- Status: ${text(project.status)}
- Stars: ${project.repo.stars}
- Repository: ${link(project.repo.full_name, repository)}
- Website: ${website ? link("Website", website) : "unavailable"}
- Tags: ${project.tags.map((tag) => link(tag.name, `/projects.md?tags=${tag.code}`)).join(", ")}
${project.packages.map((pkg) => `- Package: ${link(pkg.name, `https://www.npmjs.com/package/${pkg.name}`)}`).join("\n")}

## Trends

${
  Object.entries(getProjectTrends(project.repo.snapshots))
    .filter(([, value]) => value != null)
    .map(([period, value]) => `- ${text(period)}: ${text(value)}`)
    .join("\n") || "Trend data unavailable."
}

## README

${link("Read the upstream README", githubReadmeURL(project.repo.full_name, project.repo.default_branch, project.packagePath))}`,
    `/projects/${slug}`,
  );
}
