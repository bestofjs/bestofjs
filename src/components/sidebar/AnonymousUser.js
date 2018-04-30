import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Button from '../common/form/Button'

const LoginButton = styled(Button)`
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  color: #fff;
  display: block;
  border: 1px solid #fff;
  transition: all 0.3s;
`

const AnonymousUser = ({ pending, onLogin }) => {
  if (pending)
    return <div style={{ color: 'white', textAlign: 'center' }}>Loading...</div>
  return (
    <div style={{ padding: '1em' }}>
      <LoginButton onClick={onLogin}>
        <span className="octicon octicon-mark-github" /> Sign in with GitHub
      </LoginButton>
    </div>
  )
}

AnonymousUser.propTypes = {
  onLogin: PropTypes.func.isRequired,
  pending: PropTypes.bool.isRequired
}

export default AnonymousUser
