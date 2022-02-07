import React from "react";
import { IoLogoNpm } from "react-icons/io";

import {
  Box,
  Card,
  CardBody,
  HStack,
  Icon,
  CardSection,
  ExternalLink,
  Spinner,
} from "components/core";
import { ExternalLinkIcon } from "components/core/icons";
import { Dependencies } from "./dependencies";
import { BundleSize } from "./bundle-size";
import { PackageSize } from "./package-size";
import { PackageMonthlyDownloadChart } from "./monthly-download-chart";

type Props = {
  project: BestOfJS.ProjectDetails;
  isLoading: boolean;
  error: Error;
};
export const NpmCard = (props: Props) => {
  return (
    <Card style={{ marginTop: "2rem" }}>
      <HStack alignItems="center" py={1} px={4} borderBottomWidth="1px">
        <Icon
          as={IoLogoNpm}
          className="icon"
          fontSize="44px"
          color="red.500"
          transform="translateY(3px)"
        />
        <Box>Package on NPM</Box>
      </HStack>
      <CardBody>
        <CardBodyContent {...props} />
      </CardBody>
    </Card>
  );
};

const CardBodyContent = ({ project, isLoading, error }) => {
  if (error)
    return (
      <CardSection>Unable to load package details {error.message}</CardSection>
    );
  if (isLoading) return <Spinner />;

  const { packageName, npm } = project;
  return (
    <>
      <CardSection>
        <p>
          <ExternalLink url={`https://www.npmjs.com/package/${packageName}`}>
            {packageName} {npm.version}
            <ExternalLinkIcon />
          </ExternalLink>
        </p>
      </CardSection>
      <CardSection>
        <PackageMonthlyDownloadChart project={project} />
      </CardSection>
      <CardSection>
        <Dependencies project={project} />
      </CardSection>
      <CardSection>
        <BundleSize project={project} />
      </CardSection>
      <CardSection>
        <PackageSize project={project} />
      </CardSection>
    </>
  );
};
