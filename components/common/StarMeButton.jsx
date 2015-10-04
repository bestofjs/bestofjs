var React = require('react');
//var PropTypes = React.PropTypes;

var StarMeButton = React.createClass({

  render: function() {
    return (
      <a id="star-button" href={ this.props.url }>
        <i className="fa fa-github-alt"></i>
        {' '}
        Star on Github
      </a>
    );
  }

});
module.exports = StarMeButton;
