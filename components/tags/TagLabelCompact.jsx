var React = require('react');
var {Link} = require('react-router');

require('./style.styl');

var TagLabel = React.createClass({
  render: function() {
    var tag = this.props.tag;
    var style = {
      container: {
        padding: '2px 0'
      },
    };
    return (
      <Link to={ 'tags' } params={{ id: tag._id }}
        key={ tag._id }
        className="project-tag-compact"
        style={ style.container }
      >
        <span>{ tag.name }</span>
      </Link>
    );
  }

});

module.exports = TagLabel;
