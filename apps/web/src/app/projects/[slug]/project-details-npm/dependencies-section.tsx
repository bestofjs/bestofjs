import type { ProjectDetails } from "@repo/db/projects";

import { ChevronRightIcon, ExternalLinkIcon } from "@/components/core";
import { ProjectTable } from "@/components/project-list/project-table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { api } from "@/server/api";

export async function DependenciesSection({
  project,
}: {
  project: ProjectDetails;
}) {
  const packageData = project.packages?.[0];
  const dependencies = (packageData?.dependencies as string[]) || [];
  if (dependencies.length === 0) {
    return <div>No dependencies</div>;
  }
  const { projects } = await api.projects.findProjects({
    criteria: { npm: { $in: dependencies } },
  });
  const dependenciesNotOnBestOfJS = dependencies.filter(
    (dependency) => !projects.find((project) => project.npm === dependency),
  );

  return (
    <Collapsible>
      <CollapsibleTrigger className="group flex items-center">
        <ChevronRightIcon className="size-6 group-data-[state=open]:rotate-90" />
        Dependencies
        <Badge variant={"secondary"} className="ml-2">
          {dependencies.length}
        </Badge>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 py-4">
        {projects.length > 0 && (
          <Card>
            <ProjectTable projects={projects} />
          </Card>
        )}
        {dependenciesNotOnBestOfJS.length > 0 && (
          <Card>
            <Table className="text-md">
              <TableBody>
                {dependenciesNotOnBestOfJS.map((dependency) => (
                  <TableRow key={dependency}>
                    <TableCell className="p-0">
                      <a
                        className="flex w-full items-center gap-2 px-4 py-2 font-sans"
                        href={`https://npmjs.org/package/${dependency}`}
                      >
                        {dependency}
                        <ExternalLinkIcon className="size-4" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
