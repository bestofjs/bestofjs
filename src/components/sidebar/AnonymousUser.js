import React from 'react'
import PropTypes from 'prop-types'

const AnonymousUser = ({ pending, onLogin }) => {
  if (pending)
    return <div style={{ color: 'white', textAlign: 'center' }}>Loading...</div>
  return (
    <div style={{ padding: '1em' }}>
      <button className="ui btn login-button" onClick={onLogin}>
        <span className="octicon octicon-mark-github" /> Sign in with GitHub
      </button>
    </div>
  )
}

AnonymousUser.propTypes = {
  onLogin: PropTypes.func.isRequired,
  pending: PropTypes.bool.isRequired
}

export default AnonymousUser
