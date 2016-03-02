import React from 'react';

const StarMeButton = React.createClass({
  render() {
    return (
      <a className="btn" id="star-button" href={ this.props.url }>
        <span className="octicon octicon-octoface"></span>
        {' '}
        Star on Github
      </a>
    );
  }

});
module.exports = StarMeButton;
