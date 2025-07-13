import { useFetchProjectReadMe } from "api/hooks";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardSection,
  Spinner,
} from "components/core";
import DOMPurify from "dompurify";
import { GoBook } from "react-icons/go";

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
        {/* @ts-expect-error TODO fix me */}
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

  // biome-ignore lint/security/noDangerouslySetInnerHtml: TODO
  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;
};
