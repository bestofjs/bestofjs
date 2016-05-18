import React, { PropTypes } from 'react'
const LoggedinUser = React.createClass({
  propTypes: {
    username: PropTypes.string.isRequired,
    onLogout: PropTypes.func.isRequired
  },
  render() {
    const { username, onLogout, pending } = this.props
    if (pending) return (
      <div>Loading...</div>
    )
    return (
      <div className="sidebar-username-block">
        <div className="username">{username}</div>
        <a
          className="logout-button"
          title="Sign out"
          data-balloon={`Sign out`}
          data-balloon-pos="left"
          href="#"
          onClick={ e => {e.preventDefault(); onLogout()} }
        >
          <span className="octicon octicon-x" style={{ justifyContent: 'flex-end' }}></span>
        </a>
      </div>
    )
  }
})
export default LoggedinUser
