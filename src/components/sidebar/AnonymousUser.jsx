import React, { PropTypes } from 'react';
const AnonymousUser = React.createClass({
  propTypes: {
    onLogin: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired
  },
  render() {
    const { onLogin, pending } = this.props;
    if (pending) return (
      <div>Loading...</div>
    );
    return (
      <div>
        <button className="ui inverted btn" onClick={ onLogin }>
          <span className="octicon octicon-mark-github"></span>
          {' '}
          Sign in with Github
        </button>
      </div>
    );
  }
});
export default AnonymousUser;
