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
      <div style={{ backgroundColor: 'rgba(0,0,0,0.15)', padding: '0.5em 1em' }}>
        <div style={{ fontSize: 16, color: 'white', display: 'flex' }}>
          {false && <span className="octicon octicon-person"></span>}
          { username }
          {' '}
          {true && <a
            className="logout-button"
            title="Sign out"
            href=""
            style={{ 'flex': '1', display: 'block', textAlign: 'right' }}
            onClick={ e => {e.preventDefault(); onLogout();} }
          >
            <span className="octicon octicon-x" style={{ justifyContent: 'flex-end' }}></span>
          </a>}
        </div>
      </div>
    );
  }
});
export default LoggedinUser;
