import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Div = styled.div`
  padding: 0.5em 1em;
  background-color: rgba(0, 0, 0, 0.149);
  font-size: 16px;
  color: #fff;
  display: flex;
  .username {
    flex: 1;
  }
`

const LogoutButton = styled.a`
  color: rgba(255, 255, 255, 0.6);
  flex-grow: 0;
  :hover {
    color: #fff;
  }
`

const LoggedinUser = ({ username, onLogout, pending }) => {
  if (pending) return <div>Loading...</div>
  const handleClick = e => {
    e.preventDefault()
    onLogout()
  }
  return (
    <Div className="sidebar-username-block">
      <div className="username">{username}</div>
      <LogoutButton
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
      </LogoutButton>
    </Div>
  )
}

LoggedinUser.propTypes = {
  username: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired
}

export default LoggedinUser
