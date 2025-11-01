import { Suspense } from "react";
import invariant from "tiny-invariant";

import { getAllTags } from "@repo/db/projects";

import { ProjectLogo } from "@/components/project-logo";
import { projectService } from "@/db";

import { ViewProjectPackages } from "./view-packages";
import { ViewProject } from "./view-project";
import { ViewRepo } from "./view-repo";
import { ViewSnapshots } from "./view-snapshots";
import { ViewTags } from "./view-tags";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ViewProjectPage(props: PageProps) {
  const params = await props.params;

  const { slug } = params;

  const project = await projectService.getProjectBySlug(slug);
  const allTags = await getAllTags();

  if (!project) {
    return <div>Project not found {slug}</div>;
  }

  const { repo } = project;
  invariant(repo, "Project must have a repository");
  invariant(project.repoId, "Project must have a repository");

  return (
    <Suspense fallback={<div>Loading {slug} project...</div>}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <ProjectLogo project={project} size={100} />
          <div className="flex flex-col gap-4">
            <h1 className="flex scroll-m-20 items-center gap-2 font-extrabold text-3xl tracking-tight lg:text-4xl">
              {project.name}
            </h1>
            <div>{project.description}</div>
          </div>
        </div>
        <ViewProject project={project} />
        <ViewTags project={project} allTags={allTags} />
        {project.repo ? <ViewRepo project={project} /> : <>No repository!</>}
        <ViewProjectPackages project={project} />
        {project.repo && (
          <ViewSnapshots
            snapshots={repo.snapshots}
            repoId={project.repoId}
            repoFullName={repo.owner + "/" + repo.name}
            slug={project.slug}
          />
        )}
      </div>
    </Suspense>
  );
}
