import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Button,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { GoBookmark, GoSignOut } from 'react-icons/go'

import { AuthContainer } from 'containers/auth-container'
import { ChevronDownIcon } from 'components/core/icons'

export const UserDropdownMenu = () => {
  const auth = AuthContainer.useContainer()
  const { bookmarks, logout } = AuthContainer.useContainer()
  const bookmarkCount = bookmarks.length

  return (
    <Menu placement="bottom-end">
      <MenuButton
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
      </MenuButton>
      <MenuList>
        <MenuItem icon={<GoBookmark />}>
          <Link as={RouterLink} to="/bookmarks">
            Bookmarks ({bookmarkCount})
          </Link>
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={() => logout()} icon={<GoSignOut />}>
          Sign out
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

const UserAvatar = ({ username, avatarURL, size = 32 }) => {
  const url = `${avatarURL}&size=${size}`
  return <Avatar src={url} width={size} height={size} alt={username} />
}

const Avatar = styled.img`
  border-radius: 50%;
`
