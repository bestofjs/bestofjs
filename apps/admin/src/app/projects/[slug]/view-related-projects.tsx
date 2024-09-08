import { findProjects, ProjectDetails } from "@repo/db/projects";
import { AddProjectToRepoButton } from "@/components/add-project-to-repo-button";
import { ProjectTable } from "@/components/project-table";
import { projectService } from "@/db";

type Props = {
  project: ProjectDetails;
};

export async function ViewRelatedProjects({ project }: Props) {
  return (
    <>
      <MonorepoProjectsCard project={project} />
      <SameOwnerProjectsCard project={project} />
    </>
  );
}

async function MonorepoProjectsCard({ project }: Props) {
  const projectsInSameRepo = await findProjectsByFullName(
    project.repo.full_name
  );
  const relatedProjects = projectsInSameRepo.filter(
    (foundProject) => foundProject.slug !== project.slug
  );
  return (
    <div>
      <div className="flex justify-between">
        <h3 className="text-lg font-bold">Other projects linked to the repo</h3>
        <div>
          <AddProjectToRepoButton repoId={project.repoId} />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {relatedProjects.length === 0 ? (
          <i>No related projects</i>
        ) : (
          <ProjectTable projects={relatedProjects} />
        )}
      </div>
    </div>
  );
}

async function SameOwnerProjectsCard({ project }: Props) {
  const owner = project.repo.full_name.split("/")[0];
  const projectsFromSameOwner = await findProjectsByOwner(owner);
  const otherProjects = projectsFromSameOwner.filter(
    (foundProject) => foundProject.repo?.full_name !== project.repo.full_name
  );
  return (
    <div>
      <h3 className="text-lg font-bold">
        Other projects from <i>{owner}</i>
      </h3>
      <div>
        {otherProjects.length === 0 ? (
          <i>No other projects from {owner}</i>
        ) : (
          <ProjectTable projects={otherProjects} />
        )}
      </div>
    </div>
  );
}

async function findProjectsByOwner(owner: string) {
  return await findProjects({
    db: projectService.db,
    owner,
    sort: "-stars",
    limit: 0,
    offset: 0,
  });
}

async function findProjectsByFullName(full_name: string) {
  return await findProjects({
    db: projectService.db,
    full_name,
    sort: "-stars",
    limit: 0,
    offset: 0,
  });
}
