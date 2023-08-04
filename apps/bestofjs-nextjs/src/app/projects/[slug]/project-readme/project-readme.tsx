import { Suspense } from "react";
import { GoBook } from "react-icons/go";

import { Card, CardHeader } from "@/components/ui/card";
import { ErrorBoundary } from "@/app/error-handling";

export async function ReadmeCard({ project }: { project: BestOfJS.Project }) {
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
            {/* @ts-expect-error Server Component */}
            <ReadmeContent project={project} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </Card>
  );
}

async function ReadmeContent({ project }: { project: BestOfJS.Project }) {
  const html = await getData(project.full_name, project.branch);
  // if (error) return <div>Unable to fetch README.md content from GitHub</div>;

  // if (!html) return <Spinner />;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

async function getData(fullName: string, branch: string) {
  const url = `https://bestofjs-serverless.vercel.app/api/project-readme?fullName=${fullName}&branch=${branch}`;
  const html = await fetch(url).then((r) => r.text());
  return html;
}
