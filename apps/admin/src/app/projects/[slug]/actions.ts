"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import { EditableProjectData } from "@/database";
import { addPackage, removePackage } from "@/database/projects/packages";
import { saveTags } from "@/database/projects/tags";
import { updateProjectById } from "@/database/projects/update";
import { EditableTagData, updateTagById } from "@/database/tags/update";
import { Tag } from "@/components/ui/tags/tag-input";

export async function updateProjectData(
  projectId: string,
  projectData: EditableProjectData
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

export async function updateTagData(tagId: string, tagData: EditableTagData) {
  await updateTagById(tagId, tagData);
  revalidatePath(`/tags/${tagData.code}`);
  revalidatePath(`/tags`);
}

export async function addPackageAction(
  projectId: string,
  projectSlug: string,
  packageName: string
) {
  await addPackage(projectId, packageName);
  revalidatePath(`/projects/${projectSlug}`);
}

export async function removePackageAction(
  projectId: string,
  projectSlug: string,
  packageName: string
) {
  await removePackage(projectId, packageName);
  revalidatePath(`/projects/${projectSlug}`);
}
