var React = require('react');
//var PropTypes = React.PropTypes;

var StarMeButton = React.createClass({

  render: function() {
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
