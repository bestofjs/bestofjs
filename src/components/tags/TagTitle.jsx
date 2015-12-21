var React = require('react');
var Router = require('react-router');
var { IndexLink } = Router;

require('../../stylesheets/tag.styl');

var TagTitle = React.createClass({
  render() {
    var tag = this.props.tag;
    return (
      <IndexLink className="tag tag-title" to="/">
        <span style={{ display: 'inline-block' }}>{ tag.name }</span>
        <span className="close-icon" style={{ fontSize: 22, marginLeft: 5, display: 'inline-block' }}>&times;</span>
      </IndexLink>
    );
  }
});
module.exports = TagTitle;
