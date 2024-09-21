import { Suspense } from "react";
import { GoBook } from "react-icons/go";

import { createGitHubClient } from "@repo/api/github";
import { ProjectDetails } from "@repo/db/projects";
import { ErrorBoundary } from "@/app/error-handling";
import { Card, CardHeader } from "@/components/ui/card";

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
  const gitHubClient = createGitHubClient();
  const { full_name, default_branch } = project.repo;
  const html = await gitHubClient.fetchRepoReadMeAsHtml(
    full_name,
    default_branch || "main"
  );
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
