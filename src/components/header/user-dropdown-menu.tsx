import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from '@emotion/styled'
import { GoBookmark, GoSignOut } from 'react-icons/go'

import { AuthContainer } from 'containers/auth-container'
import { Popover, Menu, DropdownToggleButton } from '../core'

export const UserDropdownMenu = () => {
  const history = useHistory()
  const auth = AuthContainer.useContainer()
  const { bookmarks, logout } = AuthContainer.useContainer()
  const bookmarkCount = bookmarks.length

  return (
    <Popover
      content={({ close }) => {
        const items = [
          {
            label: `Bookmarks (${bookmarkCount})`,
            onClick: () => {
              history.push('/bookmarks')
              close()
            },
            icon: <GoBookmark />
          },
          {
            label: 'Sign out',
            onClick: () => {
              logout()
              close()
            },
            icon: <GoSignOut />
          }
        ]
        return <Menu items={items} />
      }}
      alignment="right"
    >
      {({ open }) => (
        <DropdownToggleButton
          onClick={open}
          style={{ padding: '0.2rem 0.5rem' }}
        >
          <UserAvatar
            avatarURL={auth.profile?.picture}
            username={auth.profile?.name}
          />
        </DropdownToggleButton>
      )}
    </Popover>
  )
}

const UserAvatar = ({ username, avatarURL, size = 32 }) => {
  const url = `${avatarURL}&size=${size}`
  return <Avatar src={url} width={size} height={size} alt={username} />
}

const Avatar = styled.img`
  border-radius: 50%;
`
