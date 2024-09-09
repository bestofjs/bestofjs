import Link from "next/link";

import { findProjects } from "@repo/db/projects";
import { ProjectLogo } from "@/components/project-logo";
import { Badge, badgeVariants } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatStars } from "@/lib/format-helpers";

type Props = {
  projects: Awaited<ReturnType<typeof findProjects>>;
};

export function ProjectTable({ projects }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Logo</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Added at</TableHead>
          <TableHead>GitHub</TableHead>
          <TableHead>Packages</TableHead>
          <TableHead className="text-right">Stars</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.slug}>
            <TableCell>
              <ProjectLogo project={project} size={50} />
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-4">
                <Link href={`/projects/${project.slug}`}>{project.name}</Link>
                <span className="text-muted-foreground">
                  {project.description}
                </span>
                {project.comments && <div>{project.comments}</div>}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <a
                      href={`/projects/?tag=${tag}`}
                      className={badgeVariants({ variant: "secondary" })}
                      key={tag}
                    >
                      {tag}
                    </a>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              {project.createdAt.toISOString().slice(0, 10)}
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-4">
                {project.repo?.full_name || "No repo"}
                {project.repo?.archived && (
                  <div>
                    <Badge variant="destructive">Archived</Badge>
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              {project.packages.filter(Boolean).length > 0 ? (
                <div className="flex flex-col gap-4">
                  {project.packages.map((pkg) => (
                    <div key={pkg}>{pkg}</div>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground italic">No package</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              {formatStars(project.stars)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
