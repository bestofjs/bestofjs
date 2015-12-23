import React from 'react';

const SearchText = React.createClass({

  render() {
    return (
      <span>
      &ldquo;
      <span style={{ paddingX: '0 4px 0 2px', fontStyle: 'italic' }}>{ this.props.children }</span>
      {' '}&rdquo;
      </span>
    );
  }

});

module.exports = SearchText;
