import React, { PropTypes } from 'react';
const AnonymousUser = React.createClass({
  propTypes: {
    onLogin: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired
  },
  handleLogin() {
    this.props.onLogin();
  },
  render() {
    const { pending } = this.props;
    if (pending) return (
      <div style={{ color: 'white', textAlign: 'center' }}>
        Loading...
      </div>
    );
    return (
      <div style={{ padding: '1em' }}>
        <button className="ui btn login-button" onClick={ this.handleLogin }>
          <span className="octicon octicon-mark-github"></span>
          {' '}
          Sign in with Github
        </button>
      </div>
    );
  }
});
export default AnonymousUser;
