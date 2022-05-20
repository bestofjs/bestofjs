import { IoLogoNpm } from "react-icons/io";

import {
  Badge,
  Box,
  Card,
  CardBody,
  CardSection,
  Flex,
  HStack,
  Icon,
  Link,
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
        <Flex alignItems="center">
          <Link
            href={`https://www.npmjs.com/package/${packageName}`}
            isExternal
            fontFamily="button"
          >
            {packageName}
            <ExternalLinkIcon />
          </Link>
          <Badge fontSize="1rem" ml={2}>
            {npm.version}
          </Badge>
        </Flex>
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
