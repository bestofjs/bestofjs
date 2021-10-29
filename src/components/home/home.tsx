import React from "react";
import styled from "@emotion/styled";
import numeral from "numeral";
import { Link as RouterLink } from "react-router-dom";
import { GoTag, GoHeart, GoPlus } from "react-icons/go";

import {
  Button,
  ButtonProps,
  Box,
  Link,
  LinkProps,
  Center,
  PageHeader,
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
import { Row, MainColumn, RightSideBar } from "./layout";
import { HomeMonthlyRankings } from "./home-monthly-rankings";
import { DarkModeNews } from "./dark-mode-news";

export const Home = (props) => {
  log("Render the <Home> component");
  const { pending, popularTags } = props;

  return (
    <MainContent>
      <Section>
        <Row>
          <MainColumn>
            <PageHeader title="The best of JavaScript, HTML and CSS" />
            <HotProjects {...props} />
            {!pending && <NewestProjects {...props} />}
          </MainColumn>
          {!pending && (
            <RightSideBar>
              <DarkModeNews />
              <RandomFeaturedProject />
              <Section.Header icon={<GoTag fontSize={32} />}>
                <Section.Title>Popular Tags</Section.Title>
              </Section.Header>
              <CompactTagList
                tags={popularTags}
                footer={
                  <Button as={RouterLink} to={`/tags/`} variant="link">
                    View all tags »
                  </Button>
                }
              />
            </RightSideBar>
          )}
        </Row>
      </Section>
      <Tags popularTags={popularTags} isPending={pending} />
      {!pending && <HomeMonthlyRankings />}
      <StarOnGitHub />
      <MoreProjects />
    </MainContent>
  );
};

const Tags = ({ popularTags, isPending }) => {
  return (
    <SectionMobileOnly>
      <Section.Header icon={<GoTag fontSize={32} />}>
        <Section.Title>Popular tags</Section.Title>
      </Section.Header>
      {!isPending ? <ProjectTagGroup tags={popularTags} /> : <>Loading...</>}
      <Box pt={4} textAlign="center">
        <Link as={RouterLink} to={`/tags/`}>
          View all tags »
        </Link>
      </Box>
    </SectionMobileOnly>
  );
};

const SectionMobileOnly = styled(Section)`
  @media (min-width: 1000px) {
    display: none;
  }
`;

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
          <Section.Header icon={<GoHeart fontSize={32} />}>
            <Section.Title>
              Do you find {APP_DISPLAY_NAME} useful?
            </Section.Title>
          </Section.Header>
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
      <Section.Header icon={<GoPlus fontSize={32} />}>
        <Section.Title>Do you want more projects?</Section.Title>
      </Section.Header>
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
