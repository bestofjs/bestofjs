import React from 'react'
import styled from 'styled-components'

import svg from './stateofjs2018-logo.svg'

const Img = styled.img`
  max-width: 320px;
  height: auto;
  @media (min-width: 900px) and (max-width: 999px) {
    max-width: 100%;
  }
`
const Logo = props => {
  return <Img src={svg} alt="The State of JavaScript" />
}

export default Logo
