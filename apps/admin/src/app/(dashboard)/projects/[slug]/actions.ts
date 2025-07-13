"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import { createGitHubClient } from "@repo/api/github";
import {
  addPackage,
  type ProjectData,
  removePackage,
  saveTags,
  updateProjectById,
} from "@repo/db/projects";
import { type EditableTagData, updateTagById } from "@repo/db/tags";

import { snapshotsService } from "@/db";

type EditableProjectData = Omit<
  ProjectData,
  "repoId" | "id" | "createdAt" | "updatedAt"
>;

export async function updateProjectData(
  projectId: string,
  projectData: Partial<EditableProjectData>,
) {
  noStore();
  await updateProjectById(projectId, projectData);
  revalidatePath(`/projects/${projectData.slug}`);
}

export async function updateProjectTags(
  projectId: string,
  projectSlug: string,
  tagIds: string[],
) {
  await saveTags(projectId, tagIds);
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
  packageName: string,
) {
  await addPackage(projectId, packageName);
  revalidatePath(`/projects/${projectSlug}`);
}

export async function removePackageAction(
  projectId: string,
  projectSlug: string,
  packageName: string,
) {
  await removePackage(projectId, packageName);
  revalidatePath(`/projects/${projectSlug}`);
}

export async function addSnapshotAction(
  projectSlug: string,
  repoId: string,
  repoFullName: string,
) {
  const gitHubClient = createGitHubClient();
  const data = await gitHubClient.fetchRepoInfo(repoFullName);
  const stars = data.stargazers_count as number;

  // TODO add a real UI?
  console.log("Adding snapshot for", repoId, stars);

  snapshotsService.addSnapshot(repoId, stars);

  revalidatePath(`/projects/${projectSlug}`);
}
