import React from 'react'
import styled from 'styled-components'
import { GoTriangleDown, GoTriangleRight } from 'react-icons/go'

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
  const Icon = on ? GoTriangleDown : GoTriangleRight
  return (
    <TogglerLink {...getTogglerProps()}>
      <Icon className="icon" /> {children}
    </TogglerLink>
  )
}
