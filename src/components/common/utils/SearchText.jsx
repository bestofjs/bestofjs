import React from 'react'

const SearchText = React.createClass({

  render () {
    return (
      <span>
        &ldquo;
        <span style={{ fontStyle: 'italic' }}>
          {this.props.children}
        </span>
        {' '}&rdquo;
      </span>
    )
  }

})

export default SearchText
