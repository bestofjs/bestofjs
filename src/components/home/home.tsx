import React from "react";
import styled from "@emotion/styled";
import numeral from "numeral";
import { Link as RouterLink } from "react-router-dom";
import { GoTag, GoHeart, GoPlus } from "react-icons/go";

import {
  Button,
  ButtonProps,
  Box,
  Flex,
  Link,
  LinkProps,
  Center,
  PageHeader,
  SectionHeading,
} from "components/core";
import { APP_REPO_URL, APP_DISPLAY_NAME, SPONSOR_URL } from "config";
import { useSelector } from "containers/project-data-container";
import { getTotalNumberOfStars } from "selectors";
import log from "helpers/log";
import { addProjectURL } from "components/user-requests/add-project/create-issue-link";
import { ProjectTagGroup } from "components/tags/project-tag";
import { StarIcon } from "components/core/icons";
import { ExternalLink, MainContent, Section } from "components/core";
import { CompactTagList } from "components/tags/tag-list";
import { HotProjects, NewestProjects } from "./home-projects";
import { RandomFeaturedProject } from "./featured-projects";
import { HomeMonthlyRankings } from "./home-monthly-rankings";

type Props = {
  pending: boolean;
  newestProjects: BestOfJS.Project[];
  popularTags: BestOfJS.Tag[];
};
export const Home = ({ pending, newestProjects, popularTags }: Props) => {
  log("Render the <Home> component");

  return (
    <MainContent>
      <PageHeader title="The best of JavaScript, HTML and CSS" />
      <Section>
        <Flex>
          <Box flex="1 1 0%">
            <HotProjects pending={pending} />
            {!pending && <NewestProjects projects={newestProjects} />}
          </Box>
          {!pending && (
            <Box
              as="aside"
              pl={8}
              flexBasis={330}
              display={{ base: "none", lg: "block" }}
            >
              <RandomFeaturedProject />
              <SectionHeading
                icon={<GoTag fontSize={32} />}
                title="Popular Tags"
              />
              <CompactTagList
                tags={popularTags}
                footer={
                  <Button as={RouterLink} to={`/tags/`} variant="link">
                    View all tags »
                  </Button>
                }
              />
            </Box>
          )}
        </Flex>
      </Section>
      {!pending && <PopularTags tags={popularTags} />}
      {!pending && <HomeMonthlyRankings />}
      <StarOnGitHub />
      <MoreProjects />
    </MainContent>
  );
};

// Section displayed for mobile only (because the right bar is hidden on mobiles)
const PopularTags = ({ tags }: { tags: BestOfJS.Tag[] }) => {
  return (
    <Section display={{ lg: "none" }}>
      <SectionHeading icon={<GoTag fontSize={32} />} title="Popular tags" />
      <ProjectTagGroup tags={tags} />
      <Box pt={4} textAlign="center">
        <Link as={RouterLink} to={`/tags/`}>
          View all tags »
        </Link>
      </Box>
    </Section>
  );
};

const ResponsiveRow = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 700px) {
    align-items: center;
    flex-direction: row;
  }
  > *:last-child {
    padding-top: 1rem;
  }
`;

const StarOnGitHub = () => {
  return (
    <Section>
      <ResponsiveRow>
        <div style={{ flexGrow: 1 }}>
          <SectionHeading
            icon={<GoHeart fontSize={32} />}
            title={<>Do you find {APP_DISPLAY_NAME} useful?</>}
          />
          <p>
            Show your appreciation by starring the project on{" "}
            <ExternalLink url={APP_REPO_URL}>GitHub</ExternalLink>, or becoming
            a <ExternalLink url={SPONSOR_URL}>sponsor</ExternalLink>.
          </p>
          <p>Thank you for your support!</p>
        </div>
        <div>
          <StarOnGitHubButton />
          <br />
          <SponsorButton />
        </div>
      </ResponsiveRow>
    </Section>
  );
};

const StarOnGitHubButton = () => {
  const project = useSelector(
    (state) => state.entities.projects["best-of-javascript"]
  );
  if (!project) return null;
  const stars = getTotalNumberOfStars(project);
  return (
    <BigButtonLink
      href={APP_REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      addOn={
        <Center>
          {formatNumber(stars)} <StarIcon fontSize="24px" />
        </Center>
      }
    >
      Star on GitHub
    </BigButtonLink>
  );
};

const SponsorButton = () => {
  return (
    <BigButtonLink
      href={SPONSOR_URL}
      target="_blank"
      rel="noopener noreferrer"
      addOn={<GoHeart size={20} />}
    >
      Sponsor
    </BigButtonLink>
  );
};

const BigButtonLink = ({
  addOn,
  children,
  ...props
}: ButtonProps & LinkProps & { addOn: React.ReactNode }) => (
  <Button
    as="a"
    display="flex"
    variant="outline"
    className="button-link"
    {...props}
  >
    {children}
    <Box
      ml={2}
      sx={{
        ".button-link:hover &": {
          color: "var(--bestofjsOrange)",
          transition: "0.5s",
        },
      }}
    >
      {addOn}
    </Box>
  </Button>
);

const formatNumber = (number) => numeral(number).format("");

const MoreProjects = () => {
  return (
    <Section>
      <SectionHeading
        icon={<GoPlus fontSize={32} />}
        title="Do you want more projects?"
      />
      <p>
        <i>{APP_DISPLAY_NAME}</i> is a curated list of about 1500 open-source
        projects related to the web platform and Node.js.
      </p>
      <p>
        If you want to suggest a new project, please click on the following
        link:{" "}
        <ExternalLink url={addProjectURL}>recommend a new project</ExternalLink>
        .
      </p>
    </Section>
  );
};
