var React = require('react');
import fromNow from '../../helpers/fromNow';

require('./footer.styl');

var Footer = React.createClass({
  render: function() {
    var {repo, projectName} = this.props.staticContent;
    var lastUpdate = this.props.lastUpdate;
    return (
      <div id="footer">
        <p>{ projectName } is a project by <a href="http://michaelrambeau.com">Michael Rambeau</a> made in Osaka.</p>
        <p>View on <a href={ repo }>Github</a></p>
        <p>Data updated from Github everyday. Last update: {fromNow(lastUpdate) }</p>
        <a href="https://js.org" target="_blank" title="JS.ORG | JavaScript Community">
          <img src="images/dark_horz.png" width="102" alt="JS.ORG Logo"/>
        </a>
      </div>
    );
  }

});

module.exports = Footer;
