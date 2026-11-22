import { link, text } from "@/server/markdown/format";
import { markdownResponse } from "@/server/markdown/response";
import { publicContent } from "@/server/public-content";
export function GET() {
  const content = publicContent.privacy;
  return markdownResponse(
    `# ${content.title}\n\n${content.sections.map((section) => `## ${section.title}\n\n${section.paragraphs.map(text).join("\n\n")}\n\n${"links" in section ? section.links?.map((item) => `- ${link(item.label, item.url)}`).join("\n") : ""}`).join("\n\n")}`,
    "/privacy",
  );
}
