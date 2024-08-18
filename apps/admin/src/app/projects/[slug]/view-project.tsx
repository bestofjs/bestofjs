import Link from "next/link";
import { ProjectData } from "@repo/db/projects";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  project: ProjectData;
};
export function ViewProject({ project }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project data</CardTitle>
        <CardDescription>
          <code>{project.id}</code>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[200px_1fr] gap-4">
          <p>Description</p>
          <div>
            {project.description}
            {project.overrideDescription && (
              <div className="mt-2 flex items-center gap-2">
                <Checkbox checked={true} />
                <span>Override description</span>
              </div>
            )}
          </div>
          <p>URL</p>
          <div>
            {project.url ? (
              <a href={project.url} target="_blank">
                {project.url}
              </a>
            ) : (
              "-"
            )}
            {project.overrideURL && (
              <div className="mt-2 flex items-center gap-2">
                <Checkbox checked={true} />
                <span>Override URL</span>
              </div>
            )}
          </div>
          <p>Logo</p>
          <p>{project.logo}</p>
          <p>Comments</p>
          <p>{project.comments}</p>
          <p>Status</p>
          <p>{project.status}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href={`/projects/${project.slug}/edit`}
          className={buttonVariants({ variant: "default" })}
        >
          Edit
        </Link>
      </CardFooter>
    </Card>
  );
}
