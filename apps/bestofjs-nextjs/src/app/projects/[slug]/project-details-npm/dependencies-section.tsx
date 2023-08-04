import { ChevronRightIcon } from "@heroicons/react/20/solid";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardHeader } from "@/components/core";
import { ProjectTable } from "@/components/project-list/project-table";
import { searchClient } from "@/app/backend";

export async function DependenciesSection({
  project,
}: {
  project: BestOfJS.ProjectDetails;
}) {
  const dependencies = project.npm.dependencies;
  if (dependencies.length === 0) {
    return <div>No dependencies</div>;
  }
  const { projects } = await searchClient.findProjects({
    criteria: { npm: { $in: dependencies } },
  });
  const dependenciesNotOnBestOfJS = dependencies.filter(
    (dependency) =>
      !projects.find((project) => project.packageName === dependency)
  );

  return (
    <Collapsible>
      <CollapsibleTrigger className="group flex items-center">
        <ChevronRightIcon className="h-6 w-6 group-data-[state=open]:rotate-90" />
        Dependencies
        <Badge variant={"secondary"} className="ml-2">
          {dependencies.length}
        </Badge>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 py-4">
        {projects.length > 0 && (
          <Card>
            <CardHeader>
              Dependencies on <i>Best of JS</i>{" "}
              <Badge variant="secondary" className="ml-2">
                {projects.length}
              </Badge>
            </CardHeader>
            <ProjectTable projects={projects} />
          </Card>
        )}
        {dependenciesNotOnBestOfJS.length > 0 && (
          <Card>
            {projects.length > 0 && (
              <CardHeader>
                Dependencies not on <i>Best of JS</i>
                <Badge variant={"secondary"} className="ml-2">
                  {dependenciesNotOnBestOfJS.length}
                </Badge>
              </CardHeader>
            )}

            <Table className="">
              <TableBody>
                {dependenciesNotOnBestOfJS.map((dependency) => (
                  <TableRow key={dependency}>
                    <TableCell>
                      <a
                        className="font-mono hover:underline"
                        href={`https://npmjs.org/package/${dependency}`}
                      >
                        {dependency}
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
