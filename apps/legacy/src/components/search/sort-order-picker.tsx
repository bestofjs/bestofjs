import { Box, Button } from "components/core";
import { ChevronDownIcon } from "components/core/icons";
import { DropdownMenu, Menu, MenuGroup, MenuItem } from "components/core/menu";

import { useSearch } from "./search-container";
import { type SortOptionKey, sortOrderOptions } from "./sort-order-options";

const sortOptionGroups: SortOptionKey[][] = [
  ["total"],
  ["daily", "weekly", "monthly", "yearly"],
  ["monthly-downloads"],
  ["last-commit", "contributors"],
  ["created", "newest"],
  ["match"],
  ["bookmark"],
];

type Props = { value: SortOptionKey; onChange: (value: SortOptionKey) => void };
export const SortOrderPicker = ({ value, onChange }: Props) => {
  const searchContext = useSearch();
  const currentOption = sortOrderOptions[value];

  const menu = (
    <Menu>
      {sortOptionGroups.map((group, index) => {
        return (
          <MenuGroup key={index}>
            {group.map((id) => {
              const item = sortOrderOptions[id];
              return (
                <MenuItem
                  as="button"
                  key={id}
                  onClick={() => {
                    onChange(id);
                  }}
                  disabled={
                    item.disabled ? item.disabled(searchContext) : false
                  }
                >
                  {item.label}
                </MenuItem>
              );
            })}
          </MenuGroup>
        );
      })}
    </Menu>
  );

  return (
    <DropdownMenu menu={menu} w="300px" left={0} right={"inherit"}>
      <Button
        data-testid="sort-order-picker"
        variant="outline"
        rightIcon={<ChevronDownIcon />}
        size="md"
      >
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
