import React from 'react'
// import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { css } from 'styled-components/macro' // eslint-disable-line no-unused-vars

import { getBookmarkCount } from '../../selectors'
import { Popover, Menu, DropdownToggleButton } from '../core'
import { BookmarkIcon, SignOutIcon } from '../core/icons'

const HeaderDropdownMenu = withRouter(({ history, authApi }) => {
  const auth = useSelector(state => state.auth)
  const bookmarkCount = useSelector(getBookmarkCount)

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
              authApi.logout()
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
            avatarURL={auth.avatar}
            username={auth.username}
            style={{ borderRadius: '50%' }}
          />
        </DropdownToggleButton>
      )}
    </Popover>
  )
})

const UserAvatar = ({ username, avatarURL, size = 32, style }) => {
  const url = `${avatarURL}&size=${size}`
  return (
    <img src={url} width={size} height={size} style={style} alt={username} />
  )
}

export default HeaderDropdownMenu
