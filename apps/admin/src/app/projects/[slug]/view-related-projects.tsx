import { schema } from "@repo/db";
import { findProjects, ProjectDetails } from "@repo/db/projects";
import { AddProjectToRepoButton } from "@/components/add-project-to-repo-button";
import { ProjectTable } from "@/components/project-table";
import { badgeVariants } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
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
  const projectsInSameRepo = await projectService.findProjectsByRepoId(
    project.repoId
  );
  const relatedProjects = projectsInSameRepo.filter(
    (foundProject) => foundProject.id !== project.id
  );
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Other projects linked to the repo</CardTitle>
          <div>
            <AddProjectToRepoButton repoId={project.repoId} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          {relatedProjects.length === 0 ? (
            <i>No related projects</i>
          ) : (
            <CompactProjectList projects={relatedProjects} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

async function SameOwnerProjectsCard({ project }: Props) {
  const owner = project.repo.full_name.split("/")[0];
  const projectsFromSameOwner = await findProjectsByOwner(owner);
  const otherProjects = projectsFromSameOwner.filter(
    (foundProject) => foundProject.slug !== project.slug
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Other projects from <i>{owner}</i>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {otherProjects.length === 0 ? (
          <i>No other projects from {owner}</i>
        ) : (
          <ProjectTable projects={otherProjects} />
        )}
      </CardContent>
    </Card>
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

type RelatedProject = Pick<
  typeof schema.projects.$inferSelect,
  "slug" | "name" | "description" | "createdAt"
> & { tags: string[] };

/** A variation of the `ProjectTable` component, specific to the context of a given repo */
function CompactProjectList({ projects }: { projects: RelatedProject[] }) {
  return (
    <Table>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.slug}>
            <TableCell className="flex flex-col gap-4">
              <a href={`/projects/${project.slug}`} className="hover:underline">
                {project.name}
              </a>
              <div>{project.description}</div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <a
                    href={`/projects/?tag=${tag}`}
                    className={badgeVariants({ variant: "secondary" })}
                    key={tag}
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </TableCell>
            <TableCell className="w-48">
              Added: {project.createdAt.toISOString().slice(0, 10)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
