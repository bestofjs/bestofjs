import { getDatabase } from "@repo/db";
import { ProjectService, getAllTags } from "@repo/db/projects";

import { ProjectLogo } from "@/components/project-logo";

import { ProjectForm } from "./project-form";
import { TagsForm } from "./tags-form";

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function EditProjectPage({ params: { slug } }: PageProps) {
  const service = new ProjectService(getDatabase());
  const project = await service.getProjectBySlug(slug);
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
      <ProjectForm project={project} />
      <TagsForm project={project} allTags={allTags} />
    </div>
  );
}
