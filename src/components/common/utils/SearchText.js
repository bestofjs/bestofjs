import React from 'react'

const SearchText = ({ children }) => {
  return (
    <span>
      &ldquo;
      <span style={{ fontStyle: 'italic' }}>
        {children}
      </span>
      {' '}&rdquo;
    </span>
  )
}

export default SearchText
