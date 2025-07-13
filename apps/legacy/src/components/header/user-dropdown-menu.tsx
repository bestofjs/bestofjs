import { Link as RouterLink } from "react-router-dom";
import styled from "@emotion/styled";
import { Button } from "components/core";
import { ChevronDownIcon } from "components/core/icons";
import { DropdownMenu, Menu, MenuGroup, MenuItem } from "components/core/menu";
import { AuthContainer } from "containers/auth-container";
import { GoBookmark, GoSignOut } from "react-icons/go";

export const UserDropdownMenu = () => {
  const auth = AuthContainer.useContainer();
  const { bookmarks, logout } = AuthContainer.useContainer();
  const bookmarkCount = bookmarks.length;

  const menu = (
    <Menu>
      <MenuGroup>
        <MenuItem as={RouterLink} to="/bookmarks" icon={<GoBookmark />}>
          Bookmarks ({bookmarkCount})
        </MenuItem>
      </MenuGroup>
      <MenuGroup>
        <MenuItem as="button" onClick={() => logout()} icon={<GoSignOut />}>
          Sign out
        </MenuItem>
      </MenuGroup>
    </Menu>
  );

  return (
    <DropdownMenu menu={menu}>
      <Button
        data-testid="user-dropdown-menu"
        as={Button}
        rightIcon={<ChevronDownIcon />}
        py={1}
        pl={2}
        height="auto"
      >
        <UserAvatar
          avatarURL={auth.profile?.picture}
          username={auth.profile?.name}
        />
      </Button>
    </DropdownMenu>
  );
};

const UserAvatar = ({ username, avatarURL, size = 32 }) => {
  const url = `${avatarURL}&size=${size}`;
  return <Avatar src={url} width={size} height={size} alt={username} />;
};

const Avatar = styled.img`
  border-radius: 50%;
`;
