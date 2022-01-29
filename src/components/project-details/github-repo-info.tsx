import React from "react";
import numeral from "numeral";
import styled from "@emotion/styled";
import { GoMarkGithub, GoGitCommit } from "react-icons/go";
import { MdGroup } from "react-icons/md";

import { Box, Icon, HStack, SimpleGrid } from "components/core";
import { fromNow } from "helpers/from-now";
import { Card, CardBody, CardSection, ExternalLink } from "components/core";
import { getDeltaByDay, StarDelta, StarTotal } from "components/core/project";
import { ExternalLinkIcon, StarIcon } from "components/core/icons";
import { MonthlyTrendsChart } from "./monthly-trends-chart";

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

export const MonthlyTrends = ({ deltas }) => {
  const results = deltas.map(({ year, month, delta }) => ({
    year,
    month,
    value: delta,
  }));
  return (
    <>
      <p>Stars added on GitHub, month by month</p>
      <MonthlyTrendsChart results={results} showPlusSymbol />
    </>
  );
};

export const TrendSummary = ({ project }) => {
  const { trends } = project;
  const items = [
    { label: "Yesterday", category: "daily" },
    { label: "Last week", category: "weekly" },
    { label: "Last month", category: "monthly" },
    { label: "Last 12 months", category: "yearly" },
  ].filter(({ category }) => {
    const value = trends[category];
    return value !== undefined && value !== null;
  });

  const OnlyYesterday = ({ trends }) => {
    const value = trends.daily;
    if (value === 0) return <div>No star added on GitHub yesterday</div>;
    return value > 0 ? (
      <div style={{ display: "flex", alignItems: "center" }}>
        {value}
        <StarIcon /> added yesterday
      </div>
    ) : (
      <div>
        {value}
        <StarIcon /> lost yesterday
      </div>
    );
  };
  return (
    <CardSection>
      {trends.weekly || trends.weekly === 0 ? (
        <div>
          <Box mb={4}>Stars added on GitHub, per day, on average</Box>
          <Div>
            {items.map((item, i) => (
              <MonthlyTrendsItem item={item} key={i} trends={trends} />
            ))}
          </Div>
        </div>
      ) : (
        <OnlyYesterday trends={trends} />
      )}
    </CardSection>
  );
};

const Div = styled.div`
  width: 100%;
  display: flex;
  > div {
    flex: 1;
    text-align: center;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    > div:not(:first-of-type) {
      margin-top: 0.5rem;
    }
  }
`;

const MonthlyTrendsItem = ({ item, trends }) => {
  const { label, category } = item;
  const value = getDeltaByDay(category)({ trends });
  if (value === undefined) return null;
  return (
    <div>
      <div>{label}</div>
      <StarDelta value={value} average={category !== "daily"} />
    </div>
  );
};
