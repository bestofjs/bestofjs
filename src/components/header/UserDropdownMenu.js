import React from 'react'
// import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Octicon, { Bookmark, SignOut } from '@primer/octicons-react'

import { getBookmarkCount } from '../../selectors'
import { Button, Popover, Menu } from '../core'

const HeaderDropdownMenu = withRouter(({ history, authApi }) => {
  const auth = useSelector(state => state.auth)
  const bookmarkCount = useSelector(getBookmarkCount)

  const items = [
    {
      label: `Bookmarks (${bookmarkCount})`,
      onClick: () => history.push('/myprojects'),
      icon: (
        <Octicon>
          <Bookmark />
        </Octicon>
      )
    },
    {
      label: 'Sign out',
      onClick: () => authApi.logout(),
      icon: (
        <Octicon>
          <SignOut />
        </Octicon>
      )
    }
  ]

  return (
    <Popover content={({ close }) => <Menu items={items} />} alignment="right">
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
