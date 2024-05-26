import invariant from "tiny-invariant";

import { getProjectBySlug } from "@/database/projects/get";
import { getAllTags } from "@/database/projects/tags";
import { ProjectLogo } from "@/components/project-logo";

import { ViewProjectPackages } from "./view-packages";
import { ViewProject } from "./view-project";
import { ViewRepo } from "./view-repo";
import { ViewSnapshots } from "./view-snapshots";
import { ViewTags } from "./view-tags";

type PageProps = {
  params: {
    slug: string;
  };
};

export const revalidate = 0;

export default async function ViewProjectPage({ params: { slug } }: PageProps) {
  const project = await getProjectBySlug(slug);
  const allTags = await getAllTags();

  if (!project) {
    return <div>Project not found {slug}</div>;
  }
  const { repo } = project;
  invariant(repo, "Project must have a repository");
  invariant(project.repoId, "Project must have a repository");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <ProjectLogo project={project} size={100} />
        <div className="flex flex-col gap-4">
          <h1 className="flex scroll-m-20 items-center gap-2 text-3xl font-extrabold tracking-tight lg:text-4xl">
            {project.name}
          </h1>
          <div>{project.description}</div>
        </div>
      </div>
      {/* <TagsForm project={project} allTags={allTags} /> */}
      <ViewProject project={project} />
      <ViewTags project={project} allTags={allTags} />
      {project.repo ? <ViewRepo repo={project.repo} /> : <>No repository!</>}
      <ViewProjectPackages project={project} />
      {project.repo && (
        <ViewSnapshots
          snapshots={repo.snapshots}
          repoId={project.repoId}
          repoFullName={repo.full_name}
          slug={project.slug}
        />
      )}
    </div>
  );
}
