import { markdownNotFound } from "@/server/markdown/response";

export function GET() {
  return markdownNotFound();
}
