import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Flex, SectionHeading, Spinner } from "components/core";
import { ChevronDownIcon } from "components/core/icons";
import { DropdownMenu, Menu, MenuGroup, MenuItem } from "components/core/menu";
import {
  ProjectScore,
  ProjectTable,
} from "components/project-list/project-table";
import type { SortOptionKey } from "components/search/sort-order-options";
import { APP_DISPLAY_NAME } from "config";
import { GoFlame, GoGift } from "react-icons/go";

const ranges = {
  daily: "the last 24 hours",
  weekly: "the last 7 days",
  monthly: "the last 30 days",
  yearly: "the last 12 months",
};

export const HotProjects = ({
  projects,
  sort,
  onChangeSort,
  pending,
}: {
  projects: BestOfJS.Project[];
  sort: SortOptionKey;
  onChangeSort: (value: SortOptionKey) => void;
  pending: boolean;
}) => {
  return (
    <Box mb={8} data-testid="hot-projects-section">
      <Flex alignItems="center">
        <Box flexGrow={1}>
          <SectionHeading
            icon={<GoFlame fontSize={32} />}
            title="Hot Projects"
            subtitle={
              <>
                by number of stars added <b>{ranges[sort]}</b>
              </>
            }
          />
        </Box>
        <Box>
          <HotProjectsPicker value={sort} onChange={onChangeSort} />
        </Box>
      </Flex>
      {pending ? (
        <Spinner bg="var(--cardBackgroundColor)" borderWidth="1px" mb={4} />
      ) : (
        <ProjectTable
          projects={projects}
          showDetails={false}
          metricsCell={(project) => (
            <ProjectScore project={project} sortOptionId={sort} />
          )}
          footer={
            <Button
              variant="link"
              as={RouterLink}
              to={`/projects?sort=${sort}`}
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
      <Button
        data-testid="hot-projects-button"
        variant="outline"
        rightIcon={<ChevronDownIcon />}
        size="md"
      >
        {currentOption.label}
      </Button>
    </DropdownMenu>
  );
};

export const NewestProjects = ({
  projects,
}: {
  projects: BestOfJS.Project[];
}) => {
  return (
    <div data-testid="newest-section">
      <SectionHeading
        icon={<GoGift fontSize={32} />}
        title="Recently Added Projects"
        subtitle={
          <>
            Latest additions to <i>{APP_DISPLAY_NAME}</i>
          </>
        }
      />
      <ProjectTable
        projects={projects}
        metricsCell={(project) => (
          <ProjectScore project={project} sortOptionId={"daily"} />
        )}
        footer={
          <Button as={RouterLink} to="/projects?sort=newest" variant="link">
            View more »
          </Button>
        }
      />
    </div>
  );
};
