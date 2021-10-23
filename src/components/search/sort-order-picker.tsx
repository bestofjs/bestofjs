import React from "react";

import { Box, Button } from "components/core";
import { ChevronDownIcon } from "components/core/icons";
import { useSearch } from "./search-container";
import { sortOrderOptions } from "./sort-order-options";
import { DropdownMenu, Menu, MenuGroup, MenuItem } from "components/core/menu";

type Option = {
  id: string;
  label: string;
  disabled?: (params: { query: string; location: any }) => boolean;
};

const groups: Array<Option[]> = [
  [
    {
      id: "total",
      label: "By total number of stars",
    },
  ],
  [
    {
      id: "daily",
      label: "By stars added yesterday",
    },
    {
      id: "weekly",
      label: "By stars added the last 7 days",
    },
    {
      id: "monthly",
      label: "By stars added the last 30 days",
    },
    {
      id: "yearly",
      label: "By stars added the last 12 months",
    },
  ],
  [
    {
      id: "monthly-downloads",
      label: "By downloads the last 30 days",
    },
  ],
  [
    {
      id: "last-commit",
      label: "By date of the latest commit",
    },
    {
      id: "contributors",
      label: "By number of contributors",
    },
  ],
  [
    {
      id: "created",
      label: "By date of creation (Oldest first)",
    },
    {
      id: "newest",
      label: "By date of addition on Best of JS",
    },
  ],
  [
    {
      id: "match",
      label: "Best matching",
      disabled: ({ query }) => query === "",
    },
  ],
  [
    {
      id: "bookmark",
      label: "By date of the bookmark",
      disabled: ({ location }) => location.pathname !== "/bookmarks",
    },
  ],
];

export const SortOrderPicker = ({ value, onChange }) => {
  const searchContext = useSearch();
  const currentOption = sortOrderOptions.find(({ id }) => id === value);

  const menu = (
    <Menu>
      {groups.map((group, index) => {
        return (
          <MenuGroup key={index}>
            {group.map((item) => (
              <MenuItem
                as="button"
                key={item.id}
                onClick={() => {
                  onChange(item.id);
                }}
                disabled={item.disabled ? item.disabled(searchContext) : false}
              >
                {item.label}
              </MenuItem>
            ))}
          </MenuGroup>
        );
      })}
    </Menu>
  );

  return (
    <DropdownMenu menu={menu} w="300px" left={0} right={"inherit"}>
      <Button variant="outline" rightIcon={<ChevronDownIcon />} size="md">
        {currentOption ? (
          <>
            <Box as="span" mr={2}>
              Sort:
            </Box>
            <span>{currentOption.label}</span>
          </>
        ) : (
          "Sort..."
        )}
      </Button>
    </DropdownMenu>
  );
};
