import React from 'react'
import styled from '@emotion/styled'

export const ProgressBar = ({ progress }) => (
  <Container>
    <AnimatedBar style={{ width: progress + `%` }} />
  </Container>
)

const Container = styled.div`
  width: 100%;
  height: 1px;
`
const AnimatedBar = styled.div`
  height: 1px;
  background-color: var(--iconColor);
  transition: width 500ms ease-in-out;
`
