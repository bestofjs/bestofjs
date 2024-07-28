import React from "react";
import { ProjectDetails } from "@repo/db/projects";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AddPackageButton } from "./edit/add-package-button";
import { RemovePackageButton } from "./edit/remove-package-button";

type Props = {
  project: ProjectDetails;
};

export function ViewProjectPackages({ project }: Props) {
  const packages = project?.packages;
  if (!packages) return null;

  return (
    <div className="rounded border p-4">
      <div className="flex items-center justify-between">
        <h3 className="pb-4 text-2xl">Packages</h3>
        <AddPackageButton project={project} />
      </div>
      <div className="flex flex-wrap gap-4">
        {packages.map((pkg) => (
          <ViewPackage
            key={pkg.name}
            pkg={pkg as ProjectPackage}
            renderRemove={
              <RemovePackageButton project={project} packageName={pkg.name} />
            }
          />
        ))}
      </div>
    </div>
  );
}

type ProjectPackage = Props["project"]["packages"][number] & {
  dependencies: string[];
};

function ViewPackage({
  pkg,
  renderRemove,
}: {
  pkg: ProjectPackage;
  renderRemove: React.ReactNode;
}) {
  const dependencies = pkg.dependencies || [];

  return (
    <Card className="max-w-[400px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {pkg.name}
          <Badge>{pkg.version || "?"}</Badge>
          {pkg.deprecated && <Badge variant="destructive">Deprecated</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {dependencies.length > 0 ? (
          <>
            <p className="mb-2 text-xl">Dependencies</p>
            <ul>
              {(dependencies || []).map((dep) => (
                <li key={dep}>{dep}</li>
              ))}
            </ul>
          </>
        ) : (
          <div className="text-xl italic">No dependencies</div>
        )}
      </CardContent>
      <CardFooter>{renderRemove}</CardFooter>
    </Card>
  );
}
