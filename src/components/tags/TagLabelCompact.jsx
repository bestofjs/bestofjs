var React = require('react');
var { Link } = require('react-router');

var TagLabel = React.createClass({
  render() {
    var tag = this.props.tag;
    return (
      <Link
        to={ '/tags/' + tag.id }
        key={ tag.id }
        className="tag tag-compact"
      >
        <span>{ tag.name }</span>
      </Link>
    );
  }
});
module.exports = TagLabel;
