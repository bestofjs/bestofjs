import { currentApp } from "@/config/apps";
import { link, text } from "@/server/markdown/format";
import { markdownResponse } from "@/server/markdown/response";

import { getTagsData } from "../page-data";
export async function GET() {
  const tags = await getTagsData(currentApp);
  return markdownResponse(
    `# Tags

${tags.map((tag) => `- ${link(tag.name, `/projects.md?tags=${tag.code}`)}: ${text(tag.description)} (${tag.count} projects)`).join("\n")}`,
    "/tags",
  );
}
