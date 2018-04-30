import React from 'react'
import styled from 'styled-components'

const Span = styled.span`
  float: right;
  color: rgba(255, 255, 255, 0.5);
`

const Counter = ({ count }) => <Span>{count}</Span>

export default Counter
