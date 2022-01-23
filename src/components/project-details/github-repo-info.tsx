import React from "react";
import numeral from "numeral";
import styled from "@emotion/styled";
import { GoMarkGithub, GoGitCommit } from "react-icons/go";
import { MdGroup } from "react-icons/md";

import { Box, Icon, HStack, SimpleGrid } from "components/core";
import { fromNow } from "helpers/from-now";
import { Card, CardBody, CardSection, ExternalLink } from "components/core";
import { StarTotal } from "components/core/project";
import { ExternalLinkIcon } from "components/core/icons";
import MonthlyTrends from "./trends-card/monthly-trends";
import { TrendSummary } from "./trends-card";

const formatNumber = (number) => numeral(number).format("0,0");

type Props = { project: BestOfJS.ProjectDetails };
export const GitHubRepoInfo = ({ project }: Props) => {
  const {
    full_name,
    repository,
    stars,
    created_at,
    pushed_at,
    contributor_count,
    commit_count,
    timeSeries,
  } = project;
  const monthlyDeltas = timeSeries?.monthly;

  return (
    <Card>
      <HStack
        alignItems="center"
        py={2}
        px={4}
        borderBottomWidth="1px"
        backgroundX="linear-gradient(120deg, var(--chakra-colors-orange-100) 5%, transparent 5% 95%)"
      >
        <Icon as={GoMarkGithub} fontSize="32px" className="icon" />
        <Box mr={2}>GitHub</Box>
        <StarTotal value={stars} />
      </HStack>
      <CardBody>
        <CardSection>
          <SimpleGrid gap={4} templateColumns={{ sm: "1fr", md: "1fr 1fr" }}>
            <Box>
              <ExternalLink url={repository}>
                {full_name}
                <ExternalLinkIcon />
              </ExternalLink>
            </Box>
            <Box>
              {created_at && (
                <>
                  Created {fromNow(created_at)}, last commit{" "}
                  {fromNow(pushed_at)}
                </>
              )}
            </Box>
            <Box>
              <Stats>
                <MdGroup size={20} className="icon" />
                {formatNumber(contributor_count)} contributors
              </Stats>
            </Box>
            <Box>
              {commit_count && (
                <Stats>
                  <GoGitCommit size={20} className="icon" />
                  {formatNumber(commit_count)} commits
                </Stats>
              )}
            </Box>
          </SimpleGrid>
        </CardSection>
        {monthlyDeltas?.length > 1 && (
          <CardSection>
            <MonthlyTrends deltas={monthlyDeltas} />
          </CardSection>
        )}
        <TrendSummary project={project} />
      </CardBody>
    </Card>
  );
};

const Stats = styled.p`
  display: flex;
  align-items: center;
  .icon {
    margin-right: 0.5rem;
  }
`;
