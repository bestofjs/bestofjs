import React from 'react'
import PropTypes from 'prop-types'

const LoggedinUser = ({ username, onLogout, pending }) => {
  if (pending) return <div>Loading...</div>
  const handleClick = e => {
    e.preventDefault()
    onLogout()
  }
  return (
    <div className="sidebar-username-block">
      <div className="username">{username}</div>
      <a
        className="logout-button"
        data-balloon={'Sign out'}
        data-balloon-pos="left"
        href="#"
        onClick={handleClick}
      >
        <span
          className="octicon octicon-x"
          style={{ justifyContent: 'flex-end' }}
        />
      </a>
    </div>
  )
}

LoggedinUser.propTypes = {
  username: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired
}

export default LoggedinUser
