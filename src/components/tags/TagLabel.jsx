import React from 'react';
import { Link } from 'react-router';

const TagLabel = React.createClass({
  render() {
    const tag = this.props.tag;
    const style = {
      counter: {
        marginLeft: 10,
        padding: '0 5px',
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
