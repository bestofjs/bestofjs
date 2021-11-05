import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { GoFlame, GoGift } from "react-icons/go";

import { Box, Button, Flex } from "components/core";
import { APP_DISPLAY_NAME } from "config";
import { useSelector } from "containers/project-data-container";
import { Section, Spinner } from "components/core";
import {
  ProjectScore,
  ProjectTable,
} from "components/project-list/project-table";
import { getProjectsSortedBy } from "selectors";
import { ChevronDownIcon } from "components/core/icons";
import { DropdownMenu, Menu, MenuGroup, MenuItem } from "components/core/menu";

const ranges = {
  daily: "the last 24 hours",
  weekly: "the last 7 days",
  monthly: "the last 30 days",
  yearly: "the last 12 months",
};

const hotProjectsExcludedTags = ["meta", "learning"];

export const isIncludedInHotProjects = (project) => {
  const hasExcludedTag = hotProjectsExcludedTags.some((tag) =>
    project.tags.includes(tag)
  );
  return !hasExcludedTag;
};

export const HotProjects = ({ hotFilter, pending }) => {
  const [sortOptionId, setSortOptionId] = useState("daily");

  const projects = useSelector(
    getProjectsSortedBy({
      filterFn: isIncludedInHotProjects,
      criteria: sortOptionId,
      limit: 5,
      start: 0,
    })
  );

  return (
    <Box mb={8}>
      <Flex alignItems="center">
        <Box flexGrow={1}>
          <Section.Header icon={<GoFlame fontSize={32} />}>
            <Section.Title>Hot Projects</Section.Title>
            <Section.SubTitle>
              by number of stars added <b>{ranges[sortOptionId]}</b>
            </Section.SubTitle>
          </Section.Header>
        </Box>
        <Box>
          <HotProjectsPicker value={sortOptionId} onChange={setSortOptionId} />
        </Box>
      </Flex>
      {pending ? (
        <Spinner bg="var(--cardBackgroundColor)" borderWidth="1px" mb={4} />
      ) : (
        <ProjectTable
          projects={projects}
          showDetails={false}
          metricsCell={(project) => (
            <ProjectScore project={project} sortOptionId={sortOptionId} />
          )}
          footer={
            <Button
              variant="link"
              as={RouterLink}
              to={`/projects?sort=${sortOptionId}`}
            >
              View full rankings »
            </Button>
          }
        />
      )}
    </Box>
  );
};

const HotProjectsPicker = ({ onChange, value }) => {
  const sortOrderOptions = [
    { id: "daily", label: "Today" },
    { id: "weekly", label: "This week" },
    { id: "monthly", label: "This month" },
    { id: "yearly", label: "This year" },
  ];

  const currentOption = sortOrderOptions.find(({ id }) => id === value);
  if (!currentOption) return null;

  const menu = (
    <Menu>
      <MenuGroup>
        {sortOrderOptions.map((item) => (
          <MenuItem
            as="button"
            key={item.id}
            onClick={() => {
              onChange(item.id);
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </MenuGroup>
    </Menu>
  );

  return (
    <DropdownMenu menu={menu}>
      <Button variant="outline" rightIcon={<ChevronDownIcon />} size="md">
        {currentOption.label}
      </Button>
    </DropdownMenu>
  );
};

export const NewestProjects = ({ newestProjects, hotFilter }) => {
  return (
    <>
      <Section.Header icon={<GoGift fontSize={32} />}>
        <Section.Title>Recently Added Projects</Section.Title>
        <Section.SubTitle>
          Latest additions to <i>{APP_DISPLAY_NAME}</i>
        </Section.SubTitle>
      </Section.Header>
      <ProjectTable
        projects={newestProjects}
        metricsCell={(project) => (
          <ProjectScore project={project} sortOptionId={"daily"} />
        )}
        footer={
          <Button as={RouterLink} to="/projects?sort=newest" variant="link">
            View more »
          </Button>
        }
      />
    </>
  );
};
