import React from 'react';
import { IndexLink } from 'react-router';

// require('../../stylesheets/tag.styl');

const TagTitle = React.createClass({
  render() {
    const tag = this.props.tag;
    return (
      <IndexLink className="tag tag-title" to="/">
        <span style={{ display: 'inline-block' }}>{ tag.name }</span>
        <span className="close-icon" style={{ fontSize: 22, marginLeft: 5, display: 'inline-block' }}>&times;</span>
      </IndexLink>
    );
  }
});
module.exports = TagTitle;
