import { cacheLife } from "next/cache";

import { findTagsWithProjects } from "@/app/db";
import type { WebApp } from "@/config/apps";
import { cacheTagForApp } from "@/server/cache";
export async function getTagsData(app: WebApp) {
  "use cache";
  cacheLife("hours");
  cacheTagForApp(app, "tags");
  return findTagsWithProjects();
}
