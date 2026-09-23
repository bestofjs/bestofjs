"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { createGitHubClient } from "@repo/api/github";
import {
  addPackage,
  type ProjectData,
  removePackage,
  saveTags,
  updateProjectById,
} from "@repo/core/services/projects";
import { projectSlugSchema } from "@repo/core/shared-schemas";

import { snapshotsService } from "@/db";

type EditableProjectData = Omit<
  ProjectData,
  "repoId" | "id" | "createdAt" | "updatedAt"
>;

export async function updateProjectData(
  projectId: string,
  projectData: Partial<EditableProjectData>,
) {
  if (projectData.slug !== undefined) {
    projectData.slug = projectSlugSchema.parse(projectData.slug);
  }
  await updateProjectById(projectId, projectData);
  revalidatePath(`/projects/${projectData.slug}`);
}

export async function updateProjectTags(
  projectId: string,
  projectSlug: string,
  tagIds: string[],
) {
  await saveTags(projectId, tagIds);
  revalidateTag("tags", { expire: 0 });
  revalidatePath("/tags");
  revalidatePath(`/projects/${projectSlug}`);
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
