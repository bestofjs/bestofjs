import { Link as RouterLink } from "react-router-dom";
import { useMedia } from "react-use";
import { FiMenu } from "react-icons/fi";

import { Button, IconButton } from "components/core";
import { ChevronDownIcon, ExternalLinkIcon } from "components/core/icons";
import { DropdownMenu, Menu, MenuGroup, MenuItem } from "components/core/menu";
import { RISING_STARS_URL, STATE_OF_JS_URL } from "config";

export const NavigationDropdownMenu = () => {
  const isDesktop = useMedia("(min-width: 750px)");

  const menu = (
    <Menu>
      <MenuGroup>
        {!isDesktop && (
          <MenuItem as={RouterLink} to="/projects">
            Projects
          </MenuItem>
        )}
        {!isDesktop && (
          <MenuItem as={RouterLink} to="/tags">
            Tags
          </MenuItem>
        )}
        <MenuItem as={RouterLink} to="/rankings/monthly">
          Monthly rankings
        </MenuItem>
        <MenuItem as={RouterLink} to="/hall-of-fame">
          Hall of fame
        </MenuItem>
        <MenuItem as={RouterLink} to="/timeline">
          Timeline
        </MenuItem>
        <MenuItem as={RouterLink} to="/about">
          About
        </MenuItem>
      </MenuGroup>

      <MenuGroup>
        <MenuItem as="a" href={RISING_STARS_URL} target="_blank">
          Rising Stars
          <ExternalLinkIcon />
        </MenuItem>
        <MenuItem as="a" href={STATE_OF_JS_URL} target="_blank">
          State of JS
          <ExternalLinkIcon />
        </MenuItem>
      </MenuGroup>
    </Menu>
  );

  return (
    <DropdownMenu menu={menu}>
      {isDesktop ? (
        <Button
          variant="ghost"
          size="md"
          color="var(--textSecondaryColor)"
          rightIcon={<ChevronDownIcon />}
        >
          More
        </Button>
      ) : (
        <IconButton
          icon={<FiMenu fontSize="28px" />}
          variant="ghost"
          aria-label="Menu"
        />
      )}
    </DropdownMenu>
  );
};
