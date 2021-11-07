import React from "react";
import { GoBook } from "react-icons/go";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardSection,
  Spinner,
} from "components/core";
import { useFetchProjectReadMe } from "api/hooks";

import "stylesheets/markdown-body.css";

type Props = { project: BestOfJS.ProjectDetails };
export const ReadmeCard = ({ project }: Props) => {
  return (
    <Card className="readme">
      <CardHeader>
        <GoBook className="icon" size={20} />
        README
      </CardHeader>
      <CardBody>
        <CardSection>
          <ReadmeContent project={project} />
        </CardSection>
      </CardBody>
      <CardFooter>
        <Button as="a" href={project.repository} variant="link">
          View on GitHub
        </Button>
      </CardFooter>
    </Card>
  );
};

const ReadmeContent = ({ project }: Props) => {
  const { data: html, error } = useFetchProjectReadMe(project);

  if (error) return <div>Unable to fetch README.md content from GitHub</div>;

  if (!html) return <Spinner />;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
