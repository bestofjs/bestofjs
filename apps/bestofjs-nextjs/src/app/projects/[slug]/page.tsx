import { Suspense } from "react";
import { Metadata, ResolvingMetadata } from "next";

import { searchClient } from "@/app/backend";
import { getHotProjectsRequest } from "@/app/backend-search-requests";

import { ProjectDetailsGitHubCard } from "./project-details-github/github-card";
import { ProjectHeader } from "./project-header";
import { ReadmeCard } from "./project-readme/project-readme";
import "./project-readme/readme.css";
import { Card, CardContent } from "@/components/ui/card";

import { getProjectDetails } from "./get-project-details";
import { ProjectDetailsNpmCard } from "./project-details-npm/project-details-npm";

type PageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = params;
  const project = await getData(slug);

  return {
    title: project.name,
  };
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { slug } = params;
  const project = await getData(slug);

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
        {/* @ts-expect-error Server Component */}
        <ProjectDetailsCards project={project} />
      </Suspense>
      {/* @ts-expect-error Server Component */}
      <ReadmeCard project={project} />
    </div>
  );
}

async function ProjectDetailsCards({ project }: { project: BestOfJS.Project }) {
  const projectWithDetails = await getProjectDetails(project);
  return (
    <>
      <ProjectDetailsGitHubCard project={projectWithDetails} />
      {project.packageName && (
        <ProjectDetailsNpmCard project={projectWithDetails} />
      )}
    </>
  );
}

async function getData(projectSlug: string) {
  const project = await searchClient.getProjectBySlug(projectSlug);
  return project;
}

export async function generateStaticParams() {
  const { projects: hotProjects } = await searchClient.findProjects(
    getHotProjectsRequest()
  );

  return hotProjects.map((project) => ({ slug: project.slug }));
}
