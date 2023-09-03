import { ImNpm } from "react-icons/im";

import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardContent, CardHeader } from "@/components/ui/card";
import { Icons } from "@/components/icons";

import { BundleSizeSection } from "./bundle-size-section";
import { DependenciesSection } from "./dependencies-section";
import { MonthlyDownloadsChart } from "./monthly-downloads-charts";

export function ProjectDetailsNpmCard({
  project,
}: {
  project: BestOfJS.ProjectWithPackageDetails;
}) {
  const { packageName, packageData } = project;
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <ImNpm className="" />
          Package on NPM
        </div>
      </CardHeader>
      <CardBody>
        <CardContent>
          <div className="flex items-center gap-2">
            <a
              href={`https://www.npmjs.com/package/${packageName}`}
              className="flex items-center gap-1 font-sans text-primary hover:underline"
            >
              {packageName}
              <Icons.externalLink className="h-4 w-4" />
            </a>
            <Badge className="">{packageData.version}</Badge>
          </div>
        </CardContent>
        <CardContent>
          {/* @ts-expect-error Server Component */}
          <MonthlyDownloadsChart project={project} />
        </CardContent>
        <CardContent>
          {/* @ts-expect-error Server Component */}
          <DependenciesSection project={project} />
        </CardContent>
        {project.bundle?.gzip && (
          <CardContent>
            <BundleSizeSection project={project} />
          </CardContent>
        )}
      </CardBody>
    </Card>
  );
}
