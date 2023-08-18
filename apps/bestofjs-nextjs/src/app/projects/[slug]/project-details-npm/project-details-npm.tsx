import { ImNpm } from "react-icons/im";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CardBody, CardSection } from "@/components/core";

import { DependenciesSection } from "./dependencies-section";
import { MonthlyDownloadsChart } from "./monthly-downloads-charts";

export function ProjectDetailsNpmCard({
  project,
}: {
  project: BestOfJS.ProjectDetails;
}) {
  const { packageName, npm } = project;
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <ImNpm className="" />
          Package on NPM
        </div>
      </CardHeader>
      <CardBody>
        <CardSection>
          <div className="flex items-center gap-2">
            <a
              href={`https://www.npmjs.com/package/${packageName}`}
              className="font-sans text-primary hover:underline"
            >
              {packageName}
              {/* <ExternalLinkIcon /> */}
            </a>
            <Badge className="">{npm.version}</Badge>
          </div>
        </CardSection>
        <CardSection>
          {/* @ts-expect-error Server Component */}
          <MonthlyDownloadsChart project={project} />
        </CardSection>
        <CardSection>
          {/* @ts-expect-error Server Component */}
          <DependenciesSection project={project} />
        </CardSection>
      </CardBody>
    </Card>
  );
}
