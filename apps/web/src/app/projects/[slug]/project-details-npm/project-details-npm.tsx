import type { ProjectDetails } from "@repo/db/projects";

import { ExternalLinkIcon, NpmIcon } from "@/components/core";
import { ExternalLink } from "@/components/core/typography";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardContent, CardHeader } from "@/components/ui/card";

import { BundleSizeSection } from "./bundle-size-section";
import { DependenciesSection } from "./dependencies-section";
import { MonthlyDownloadsChart } from "./monthly-downloads-charts";

export function ProjectDetailsNpmCard({
  project,
}: {
  project: ProjectDetails;
}) {
  const packageData = project.packages?.[0];
  const packageName = packageData?.name;
  const bundleData = packageData.bundles;

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <NpmIcon className="size-6" />
          Package on NPM
        </div>
      </CardHeader>
      <CardBody>
        <CardContent>
          <div className="flex items-center gap-2">
            <ExternalLink
              url={`https://www.npmjs.com/package/${packageName}`}
              className="flex items-center gap-1 font-sans"
            >
              {packageName}
              <ExternalLinkIcon className="size-4" />
            </ExternalLink>
            <Badge className="">{packageData.version}</Badge>
          </div>
        </CardContent>
        <CardContent>
          <MonthlyDownloadsChart project={project} />
        </CardContent>
        <CardContent>
          <DependenciesSection project={project} />
        </CardContent>
        {bundleData && (
          <CardContent>
            <BundleSizeSection project={project} />
          </CardContent>
        )}
      </CardBody>
    </Card>
  );
}
