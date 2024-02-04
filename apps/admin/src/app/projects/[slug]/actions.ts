"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import { ProjectData } from "@/database";
import { saveTags } from "@/database/projects/tags";
import { updateProjectById } from "@/database/projects/update";
import { projects } from "@/database/schema";
import { Tag } from "@/components/ui/tags/tag-input";

export async function updateProjectData(
  projectId: string,
  projectData: ProjectData
) {
  noStore();
  await updateProjectById(projectId, projectData);
  revalidatePath(`/projects/${projectData.slug}`);
}

export async function updateProjectTags(
  projectId: string,
  projectSlug: string,
  tags: Tag[]
) {
  await saveTags(projectId, tags);
  revalidatePath(`/projects/${projectSlug}`);
}
