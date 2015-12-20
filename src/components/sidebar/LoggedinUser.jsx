import React, { PropTypes } from 'react';
const LoggedinUser = React.createClass({
  propTypes: {
    username: PropTypes.string.isRequired,
    onLogout: PropTypes.func.isRequired
  },
  render() {
    const { username, onLogout, pending } = this.props;
    if (pending) return (
      <div>Loading...</div>
    );
    return (
      <div>
          <div style={{ color: '#aaa' }}>Signed in as:</div>
          <div>{ username }
            {' '}
            <a className="logout" href="#" onClick={ onLogout } style={{ color: '#bbb' }}>
              sign out
            </a>
          </div>
      </div>
    );
  }
});
export default LoggedinUser;
