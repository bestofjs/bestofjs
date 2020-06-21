import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { AuthContainer } from 'containers/auth-container'
import { Popover, Menu, DropdownToggleButton } from '../core'
import { BookmarkIcon, SignOutIcon } from '../core/icons'

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
            icon: <BookmarkIcon />
          },
          {
            label: 'Sign out',
            onClick: () => {
              logout()
              close()
            },
            icon: <SignOutIcon />
          }
        ]
        return <Menu items={items} close={close} />
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
