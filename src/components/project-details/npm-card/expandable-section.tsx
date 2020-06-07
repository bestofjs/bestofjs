import React from 'react'
import styled from 'styled-components'

const TogglerLink = styled.a`
  :focus {
    outline-style: none;
  }
  color: inherit;
  cursor: pointer;
  font-size: 1rem;
  :hover {
    color: #cc4700;
  }
  .icon {
    margin-right: 0.25rem;
  }
`

export const ExpandableSection = ({ on, getTogglerProps, children }) => {
  const icon = on
    ? 'octicon octicon-triangle-down'
    : 'octicon octicon-triangle-right'
  return (
    <TogglerLink {...getTogglerProps()}>
      <span className={`octicon ${icon}`} /> {children}
    </TogglerLink>
  )
}
