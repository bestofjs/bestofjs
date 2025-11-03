import { Suspense } from "react";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

import type { ProjectDetails } from "@repo/db/projects";

import { ProjectDetailsGitHubCard } from "./project-details-github/github-card";
import { ProjectHeader } from "./project-header";
import { ReadmeCard } from "./project-readme/project-readme";

import "./project-readme/readme.css";

import { getHotProjectsRequest } from "@/app/backend-search-requests";
import { projectService } from "@/app/db";
import { Card, CardContent } from "@/components/ui/card";
import { APP_CANONICAL_URL, APP_DISPLAY_NAME } from "@/config/site";
import { api } from "@/server/api";

import { ProjectDetailsNpmCard } from "./project-details-npm/project-details-npm";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { slug } = params;
  const project = await getProjectDetailsData(slug);
  if (!project) return { title: "Project not found" };

  const title = project.name;
  const description = `Trends and data about ${project.name} project. ${project.description}`;

  return {
    title: title,
    description: description,
    openGraph: {
      images: [`/api/og/projects/${slug}`],
      url: `${APP_CANONICAL_URL}/projects/${slug}`,
      title: `#${title} on ${APP_DISPLAY_NAME}`,
      description,
    },
  };
}

export default async function ProjectDetailsPage(props: PageProps) {
  const params = await props.params;
  const { slug } = params;

  const project = await projectService.getProjectBySlug(slug);
  if (!project) {
    // TODO show a better page when an invalid slug is provided
    return <>Project not found!</>;
  }

  return (
    <div className="flex flex-col space-y-8 font-serif">
      <ProjectHeader project={project} />
      <Suspense
        fallback={
          <Card>
            <CardContent>Loading data...</CardContent>
          </Card>
        }
      >
        <ProjectDetailsCards project={project} />
      </Suspense>
      <ReadmeCard project={project} />
    </div>
  );
}

async function getProjectDetailsData(slug: string) {
  "use cache";
  cacheLife("daily");
  cacheTag("project-details", slug);
  return await projectService.getProjectBySlug(slug);
}

async function ProjectDetailsCards({ project }: { project: ProjectDetails }) {
  const packageName = project.packages?.[0]?.name;
  return (
    <>
      <ProjectDetailsGitHubCard project={project} />
      {packageName && <ProjectDetailsNpmCard project={project} />}
    </>
  );
}

export async function generateStaticParams() {
  const { projects: hotProjects } = await api.projects.findProjects(
    getHotProjectsRequest(),
  );

  return hotProjects.map((project) => ({ slug: project.slug }));
}
