import React from 'react'
import { BoxProps, Center } from './layout'
import styled from '@emotion/styled'

export const Spinner = (props: BoxProps) => (
  <Center h={200} {...props}>
    <StyledDiv />
  </Center>
)

const StyledDiv = styled.div`
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(255, 255, 255, 0.2);
  border-right: 1.1em solid rgba(255, 255, 255, 0.2);
  border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
  border-left: 1.1em solid var(--iconColor);
  transform: translateZ(0);
  animation: spin 1.1s infinite linear;

  border-radius: 50%;
  width: 10em;
  height: 10em;

  &:after {
    border-radius: 50%;
    width: 10em;
    height: 10em;
  }

  @keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`
