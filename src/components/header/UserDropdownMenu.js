import React from 'react'
// import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { getBookmarkCount } from '../../selectors'
import { Button, Popover, Menu } from '../core'
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
        <Button onClick={open}>
          {auth.name}{' '}
          <UserAvatar
            avatarURL={auth.avatar}
            username={auth.username}
            style={{ marginLeft: '0.5rem', borderRadius: '50%' }}
          />
        </Button>
      )}
    </Popover>
  )

  // return (
  //   <div>
  //     <DropdownMenu items={items} alignment="right">
  //       <>
  //         {auth.name}{' '}
  //         <UserAvatar
  //           avatarURL={auth.avatar}
  //           username={auth.username}
  //           style={{ marginLeft: '0.5rem', borderRadius: '50%' }}
  //         />
  //       </>
  //     </DropdownMenu>
  //   </div>
  // )
})

const UserAvatar = ({ username, avatarURL, size = 32, style }) => {
  const url = `${avatarURL}&size=${size}`
  return (
    <img src={url} width={size} height={size} style={style} alt={username} />
  )
}

// HeaderDropdownMenu.propTypes = {}

export default HeaderDropdownMenu
