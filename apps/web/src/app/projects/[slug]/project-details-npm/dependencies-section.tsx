import { cacheLife, cacheTag } from "next/cache";

import { db } from "@repo/core";
import {
  findProjectSlugsByPackageNames,
  type ProjectDetails,
} from "@repo/core/services/projects";

import { findProjectsWithTrends, findTags } from "@/app/db";
import {
  buildTagsByCode,
  toTrendsProject,
} from "@/app/projects/project-adapter";
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
  const { projects, dependenciesNotOnBestOfJS } = await fetchDependencyProjects(
    project.slug,
    dependencies,
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

/**
 * Splits a package's dependencies into "tracked by Best of JS" (rendered as a
 * project table) and "not tracked" (rendered as bare npm links).
 *
 * The split is driven by `findProjectSlugsByPackageNames()` rather than by
 * matching the listing rows' `npm` field: that field is
 * `project_trends.package_name`, a project's *primary* package only, so a
 * dependency a project publishes as a secondary package matched the listing
 * query but not the `npm` comparison — landing in both buckets at once.
 *
 * `limit: dependencies.length` because the default (20) silently truncated the
 * table *and*, since the "not on Best of JS" bucket was derived from the
 * truncated list, pushed tracked dependency #21 onwards into the bare-links
 * bucket. `scope: "all"` because a deprecated dependency is still on Best of JS
 * and has a page to link to.
 */
async function fetchDependencyProjects(slug: string, dependencies: string[]) {
  "use cache";
  cacheLife("days");
  cacheTag("project-details", slug);

  const [{ projects: rows }, ownedPackages, allTags] = await Promise.all([
    findProjectsWithTrends({
      limit: dependencies.length,
      packageNames: dependencies,
      scope: "all",
      sort: "most-stars",
    }),
    findProjectSlugsByPackageNames({ db, packageNames: dependencies }),
    findTags(),
  ]);

  const trackedDependencies = new Set(
    ownedPackages.map(({ packageName }) => packageName),
  );
  const tagsByCode = buildTagsByCode(allTags);

  return {
    projects: rows.map((row) => toTrendsProject(row, tagsByCode)),
    dependenciesNotOnBestOfJS: dependencies.filter(
      (dependency) => !trackedDependencies.has(dependency),
    ),
  };
}
