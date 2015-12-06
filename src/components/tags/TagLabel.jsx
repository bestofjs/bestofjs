var React = require('react');
var {Link} = require('react-router');

var TagLabel = React.createClass({
  render: function() {
    var tag = this.props.tag;
    var style = {
      counter: {
        marginLeft: 10,
        padding: '0 5px',
        //backgroundColor: '#e65100',
        color: '#ccc',
        borderRadius: 4,
        fontSize: 14
      }
    };
    return (
      <Link to={ `tags/${tag.id}` }
        key={ tag.id }
        className="tag tag-compact"
      >
        <span>{ tag.name }</span>
        <span style={ style.counter }>{tag.counter}</span>
      </Link>
    );
  }

});

module.exports = TagLabel;
