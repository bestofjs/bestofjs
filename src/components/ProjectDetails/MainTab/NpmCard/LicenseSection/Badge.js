import React from 'react'
import styled from 'styled-components'

const Span = styled.span`
  margin-left: 0.5rem;
  padding: 2px 0.25rem;
  background-color: ${props => (props.danger ? '#d63c4a' : '#f38938')};
  color: white;
  border-radius: 4px;
`

const Badge = ({ children, ...props }) => {
  return <Span {...props}>{children}</Span>
}

export default Badge
