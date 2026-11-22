import { cacheLife, cacheTag } from "next/cache";

import { projectService } from "@/app/db";
export async function getProjectDetailsData(slug: string) {
  "use cache";
  cacheLife("daily");
  cacheTag("project-details", slug);
  return await projectService.getProjectBySlug(slug);
}
