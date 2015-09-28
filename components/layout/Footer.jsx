var React = require('react');

var Footer = React.createClass({

  render: function() {
    var lastUpdate = this.props.lastUpdate;
    return (
      <div id="footer">
        <p>bestofjs is a project by <a href="http://michaelrambeau.com">Michael Rambeau</a></p>
        <p>Updated everyday. Last update: { moment(lastUpdate).fromNow() }</p>
        <a href="https://js.org" target="_blank" title="JS.ORG | JavaScript Community">
          <img src="https://logo.js.org/dark_horz.png" width="102" alt="JS.ORG Logo"/>
        </a>
      </div>
    );
  }

});

module.exports = Footer;
