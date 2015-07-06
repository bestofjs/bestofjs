var React = require('react');
var {Link} = require('react-router');

require('./style.styl');

var TagLabel = React.createClass({
  render: function() {
    var tag = this.props.tag;
    var style = {
      container: {
        color: 'white',
        padding: '2px 4px 2px 10px',
        borderRadius: 4
      },
      counter: {
        marginLeft: 10,
        padding: '0 5px',
        backgroundColor: '#e65100',
        borderRadius: 4,
        fontSize: 14
      }
    };
    return (
      <Link to={ 'tags' } params={{ id: tag._id }}
        key={ tag._id }
        className="project-tag"
        style={ style.container }
      >
        <span className="fa fa-tag" style={{ marginRight: 5 }}></span>
        <span>{ tag.name }</span>
        <span style={ style.counter }>{tag.counter}</span>
      </Link>
    );
  }

});

module.exports = TagLabel;
