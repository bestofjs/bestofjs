import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ExternalLinkIcon } from "@/components/core";
import { Icons } from "@/components/icons";
import { ProjectTable } from "@/components/project-list/project-table";
import { api } from "@/server/api";

export async function DependenciesSection({
  project,
}: {
  project: BestOfJS.ProjectWithPackageDetails;
}) {
  const dependencies = project.packageData.dependencies;
  if (dependencies.length === 0) {
    return <div>No dependencies</div>;
  }
  const { projects } = await api.projects.findProjects({
    criteria: { npm: { $in: dependencies } },
  });
  const dependenciesNotOnBestOfJS = dependencies.filter(
    (dependency) =>
      !projects.find((project) => project.packageName === dependency)
  );

  return (
    <Collapsible>
      <CollapsibleTrigger className="group flex items-center">
        <Icons.chevronRightIcon className="h-6 w-6 group-data-[state=open]:rotate-90" />
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
                        <ExternalLinkIcon size={16} />
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
