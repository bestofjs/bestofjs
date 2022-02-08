import React from "react";
import numeral from "numeral";
import styled from "@emotion/styled";
import { GoMarkGithub, GoGitCommit } from "react-icons/go";
import { MdGroup } from "react-icons/md";

import {
  Card,
  CardBody,
  CardSection,
  Link,
  Box,
  Flex,
  Icon,
  HStack,
  SimpleGrid,
} from "components/core";
import { getDeltaByDay, StarDelta, StarTotal } from "components/core/project";
import { ExternalLinkIcon, StarIcon } from "components/core/icons";
import { fromNow } from "helpers/from-now";
import { MonthlyTrendsChart } from "./monthly-trends-chart";

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
      <HStack alignItems="center" py={2} px={4} borderBottomWidth="1px">
        <Icon as={GoMarkGithub} fontSize="32px" className="icon" />
        <Box mr={2}>GitHub</Box>
        <StarTotal value={stars} />
      </HStack>
      <CardBody>
        <CardSection>
          <SimpleGrid gap={4} templateColumns={{ sm: "1fr", md: "1fr 1fr" }}>
            <Link
              href={repository}
              isExternal
              display="flex"
              alignItems="center"
              fontFamily="button"
            >
              {full_name}
              <ExternalLinkIcon />
            </Link>
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

const formatNumber = (number: Number) => numeral(number).format("0,0");

const Stats = styled.p`
  display: flex;
  align-items: center;
  .icon {
    margin-right: 0.5rem;
  }
`;

export const MonthlyTrends = ({
  deltas,
}: {
  deltas: { year: number; month: number; delta: number }[];
}) => {
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

type SummaryItem = {
  label: string;
  category: string;
};
const summaryItems: SummaryItem[] = [
  { label: "Yesterday", category: "daily" },
  { label: "Last week", category: "weekly" },
  { label: "Last month", category: "monthly" },
  { label: "Last 12 months", category: "yearly" },
];

export const TrendSummary = ({
  project,
}: {
  project: BestOfJS.ProjectDetails;
}) => {
  const { trends } = project;
  const items = summaryItems.filter(({ category }) => {
    const value = trends[category];
    return value !== undefined && value !== null;
  });

  return (
    <CardSection>
      {trends.weekly || trends.weekly === 0 ? (
        <div>
          <Box mb={4}>Stars added on GitHub, per day, on average</Box>
          <Flex w="100%" flexDir={{ base: "column", sm: "row" }}>
            {items.map((item, i) => (
              <MonthlyTrendsItem item={item} key={i} trends={trends} />
            ))}
          </Flex>
        </div>
      ) : (
        <OnlyYesterday trends={trends} />
      )}
    </CardSection>
  );
};

const OnlyYesterday = ({
  trends,
}: {
  trends: BestOfJS.ProjectDetails["trends"];
}) => {
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

const MonthlyTrendsItem = ({
  item,
  trends,
}: {
  item: SummaryItem;
  trends: BestOfJS.ProjectDetails["trends"];
}) => {
  const { label, category } = item;
  const value = getDeltaByDay(category)({ trends });
  if (value === undefined) return null;
  return (
    <Box flex="1" textAlign="center" mt={{ base: 2, sm: 0 }}>
      <div>{label}</div>
      <StarDelta value={value} average={category !== "daily"} />
    </Box>
  );
};
