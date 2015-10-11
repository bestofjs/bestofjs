var React = require('react');
var {Link} = require('react-router');

var TagLabel = React.createClass({
  render: function() {
    var tag = this.props.tag;
    return (
      <Link to={ 'tags' } params={{ id: tag.code }}
        key={ tag._id }
        className="tag tag-compact"
      >
        <span>{ tag.name }</span>
      </Link>
    );
  }

});

module.exports = TagLabel;
