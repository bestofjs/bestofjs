import { schema } from "@repo/db";
import { ProjectDetails } from "@repo/db/projects";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDateOnly, formatStars } from "@/lib/format-helpers";
import { ViewRelatedProjects } from "./view-related-projects";
import { ViewTrends } from "./view-trends";

type Props = {
  project: ProjectDetails;
};
export function ViewRepo({ project }: Props) {
  const repo = project.repo;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div>
            GitHub Repository
            {repo.archived && (
              <Badge variant="destructive" className="ml-2 text-lg">
                Archived
              </Badge>
            )}
          </div>
          <div>{formatStars(repo.stars)}</div>
        </CardTitle>
        <CardDescription>
          <code>{repo.id}</code>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <ViewRepoData repo={repo} />
          <Separator />
          <ViewTrends snapshots={repo.snapshots} />
          <Separator />
          <ViewRelatedProjects project={project} />
        </div>
      </CardContent>
    </Card>
  );
}

function ViewRepoData({ repo }: { repo: typeof schema.repos.$inferSelect }) {
  return (
    <div className="grid grid-cols-[200px_1fr] gap-4">
      <p>Full Name</p>
      <p>
        <a
          href={`https://github.com/${repo.owner}/${repo.name}`}
          className="hover:underline"
        >
          {repo.owner}/{repo.name}
        </a>
      </p>
      <p>Description</p>
      <p>{repo.description}</p>
      <p>Homepage</p>
      <p>
        {repo.homepage ? (
          <a href={repo.homepage} className="hover:underline">
            {repo.homepage}
          </a>
        ) : (
          <i className="text-muted-foreground">No homepage</i>
        )}
      </p>
      <p>Created</p>
      <p>{formatDateOnly(repo.created_at)}</p>
      <p>Pushed at</p>
      <p>{formatDateOnly(repo.pushed_at)}</p>
      <p>Commit count</p>
      <p>{repo.commit_count}</p>
      <p>Contributors</p>
      <p>{repo.contributor_count}</p>
    </div>
  );
}
