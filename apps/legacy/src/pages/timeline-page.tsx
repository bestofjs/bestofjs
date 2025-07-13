import { Link as RouterLink } from "react-router-dom";
import styled from "@emotion/styled";
import {
  Heading,
  Link,
  ListItem,
  MainContent,
  PageHeader,
  Spinner,
  Text,
  UnorderedList,
  VStack,
} from "components/core";
import { Timeline } from "components/timeline/timeline";
import { useSelector } from "containers/project-data-container";
import { allProjects } from "selectors";

export const TimelinePage = () => {
  const projects = useSelector(allProjects);
  if (!projects.length) return <Spinner />;

  const extraProjects = [
    { id: "threejs", name: "Three.js", year: 2010 },
    { id: "backbone", name: "Backbone", year: 2010 },
    { id: "meteor", name: "Meteor", year: 2012 },
    { id: "jest", name: "Jest", year: 2013 },
    { id: "redux", name: "Redux", year: 2015 },
    { id: "rollup", name: "Rollup", year: 2015 },
    { id: "gatsby", name: "Gastby", year: 2015 },
    { id: "storybook", name: "Storybook", year: 2016 },
    { id: "parcel", name: "Parcel", year: 2017 },
  ];

  return (
    <MainContent>
      <PageHeader title="Timeline: 2006-2020 in 20 projects" />
      <PageDescription>
        Our favorite newsletter{" "}
        <a href="https://javascriptweekly.com/issues/500">JavaScript Weekly</a>{" "}
        has just released its 500th issue.
        <br />
        Let's celebrate this milestone by picking 20 significant projects, from
        2006 to 2020.
        <br />A short story of the web platform from <i>jQuery</i> to{" "}
        <i>Rome</i>.<br />
        Click on the links to see the project details and the trends on{" "}
        <i>Best of JS</i>.
      </PageDescription>
      <Timeline />
      <Disclaimer>
        <VStack alignItems="flex-start">
          <Heading size="md">About this timeline / Disclaimer</Heading>
          <Text>We could have mentioned a lot of other projects:</Text>
          <UnorderedList pl={6}>
            {extraProjects.map((project) => (
              <ListItem key={project.id} mb={1}>
                <Link
                  as={RouterLink}
                  to={`/projects/${project.id}`}
                  color="var(--linkColor)"
                >
                  {project.name}
                </Link>{" "}
                ({project.year})
              </ListItem>
            ))}
          </UnorderedList>
          <Text>
            ...but we had to make choices to keep this timeline compact.
          </Text>
          <Text>The 2 main constraints were:</Text>
          <UnorderedList pl={6}>
            <ListItem>
              We wanted <b>20</b> projects because we are in 2020
            </ListItem>
            <ListItem>
              We wanted at least one project for every year between 2010 and
              2020.
            </ListItem>
          </UnorderedList>
          <Text>
            The date displayed for each project is the date of the creation of
            the repository on GitHub, except for the following projects: jQuery,
            Node.js, and TypeScript.
          </Text>
          <Text>Thank you for your understanding!</Text>
        </VStack>
      </Disclaimer>
    </MainContent>
  );
};

export default TimelinePage;

export const isIncludedInHotProjects = (project) => {
  const hotProjectsExcludedTags = ["meta", "learning"];
  const hasExcludedTag = hotProjectsExcludedTags.some((tag) =>
    project.tags.includes(tag),
  );
  return !hasExcludedTag;
};

const PageDescription = styled.div`
  padding-left: 1rem;
  border-left: 2px solid #fa9e59;
  margin-bottom: 2rem;
`;

const Disclaimer = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px dashed #fa9e59;
`;
