import { Box, Button } from "components/core";
import { ChevronDownIcon } from "components/core/icons";
import { DropdownMenu, Menu, MenuGroup, MenuItem } from "components/core/menu";

const sortOrderOptions = [
  {
    id: "project-count",
    label: "by number of projects",
  },
  {
    id: "alpha",
    label: "alphabetical order",
  },
];

export const TagListSortOrderPicker = ({ value, onChange }) => {
  const currentOption = sortOrderOptions.find(({ id }) => id === value);

  const menu = (
    <Menu>
      <MenuGroup>
        {sortOrderOptions.map((item) => (
          <MenuItem
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
        data-testid="tag-list-sort-order-picker"
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
