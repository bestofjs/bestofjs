import { Suspense } from "react";
import { GoBook } from "react-icons/go";

import { ProjectDetails } from "@repo/db/projects";

import { ErrorBoundary } from "@/app/error-handling";
import { Card, CardHeader } from "@/components/ui/card";
import { env } from "@/env.mjs";

export async function ReadmeCard({ project }: { project: ProjectDetails }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex space-x-2">
          <GoBook size={24} />
          <div>README</div>
        </div>
      </CardHeader>
      <div className="markdown-body p-4">
        <ErrorBoundary fallback={<>Unable to load the project README</>}>
          <Suspense fallback={<>Loading README.md</>}>
            <ReadmeContent project={project} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </Card>
  );
}

async function ReadmeContent({ project }: { project: ProjectDetails }) {
  const { full_name, default_branch } = project.repo;
  const html = await getData(full_name, default_branch || "main");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

async function getData(fullName: string, branch: string) {
  const url = `${env.PROJECT_DETAILS_API_ROOT_URL}/api/project-readme?fullName=${fullName}&branch=${branch}`;
  const options = {
    cache: "no-store" as RequestCache, // don't cache the response because of image URLs that become invalid after a while
  };
  const html = await fetch(url, options).then((res) => res.text());
  return html;
}
