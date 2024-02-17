import { getProjectBySlug } from "@/database/projects/get";
import { getAllTags } from "@/database/projects/tags";
import { ProjectLogo } from "@/components/project-logo";

import { ProjectForm } from "./edit/project-form";
import { TagsForm } from "./edit/tags-form";
import { ViewProject } from "./view-project";
import { ViewRepo } from "./view-repo";
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
      <ViewRepo repo={project.repo} />
    </div>
  );
}
