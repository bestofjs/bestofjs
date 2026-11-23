"use cache";
import { Suspense } from "react";
import { uniq } from "es-toolkit";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { ProjectDetails } from "@repo/core/services/projects";

import { markdownMetadata } from "@/server/markdown/metadata";

import { getProjectDetailsData } from "./page-data";
import { ProjectDetailsGitHubCard } from "./project-details-github/github-card";
import { ProjectHeader } from "./project-header";
import { ReadmeCard } from "./project-readme/project-readme";

import "./project-readme/readme.css";

import {
  getHotProjects,
  type HotProjectsSortKey,
} from "@/app/(home)/hot-projects";
import { Card, CardContent } from "@/components/ui/card";
import { currentApp } from "@/config/apps";
import { APP_CANONICAL_URL, APP_DISPLAY_NAME } from "@/config/site";

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
  if (!project) notFound();

  const title = project.name;
  const description = `Trends and data about ${project.name} project. ${project.description}`;

  return {
    title: title,
    ...markdownMetadata(`/projects/${slug}`),
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

  const project = await getProjectDetailsData(slug);
  if (!project) notFound();

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

const PRERENDERED_WINDOWS: HotProjectsSortKey[] = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
];

/**
 * Prerender the "Hot Projects" of every time window the home page's picker
 * offers, from the same `getHotProjects()` the cards themselves render from —
 * so what is built is exactly what visitors click. The windows overlap heavily,
 * so this is ~20 pages at most.
 *
 * `dynamicParams` stays on (the default): the rest of the catalog renders on
 * demand and fills its own `getProjectDetailsData()` cache entry on first hit.
 */
export async function generateStaticParams() {
  const lists = await Promise.all(
    PRERENDERED_WINDOWS.map((sort) => getHotProjects(sort, currentApp)),
  );
  const slugs = uniq(lists.flat().map((project) => project.slug));
  return slugs.map((slug) => ({ slug }));
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
