import { ImNpm } from "react-icons/im";

import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardContent, CardHeader } from "@/components/ui/card";
import { ExternalLinkIcon } from "@/components/core";
import { ExternalLink } from "@/components/core/typography";

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
            <ExternalLink
              url={`https://www.npmjs.com/package/${packageName}`}
              className="flex items-center gap-1 font-sans"
            >
              {packageName}
              <ExternalLinkIcon size={16} />
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
        {project.bundle?.gzip && (
          <CardContent>
            <BundleSizeSection project={project} />
          </CardContent>
        )}
      </CardBody>
    </Card>
  );
}
