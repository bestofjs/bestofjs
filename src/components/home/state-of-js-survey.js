import React from 'react'
import styled from 'styled-components'

import { Section } from '../core/section'
import News from './News'

const urls = {
  site: 'https://survey.stateofjs.com/'
}

const breakPoint = 900

const Row = styled.div`
  display: flex;
  @media (max-width: ${breakPoint - 1}px) {
    flex-direction: column;
  }
`

const MainCell = styled.div`
  flex-grow: 1;
`

const LogoCell = styled.div`
  text-align: right;
  @media (max-width: ${breakPoint - 1}px) {
    text-align: center;
    margin-top: 2rem;
  }
`

const StateOfJavaScript2019 = ({ date }) => {
  return (
    <Row>
      <MainCell>
        <News date={date} title={'State of JavaScript 2019'}>
          <p>
            This year too, we need your input for the{' '}
            <a href={urls.site} target="_blank">
              State of JavaScript 2019
            </a>
            .
          </p>
          <p>
            Go take the annual survey, tell us about the libraries you use, and
            help us identify the latest trends in the JavaScript ecosystem.
          </p>
        </News>
      </MainCell>
      <LogoCell>
        <a href={urls.site} target="_blank">
          <Logo />
        </a>
      </LogoCell>
    </Row>
  )
}

const Img = styled.img`
  max-width: 320px;
  height: auto;
  @media (min-width: 900px) and (max-width: 999px) {
    max-width: 100%;
  }
`
const Logo = props => {
  return (
    <Img
      width={300}
      src="https://d33wubrfki0l68.cloudfront.net/cf635f6c00b5ba3dd456f60c0c5a777a06c7f07a/fb1f7/images/stateofjs2019-logo.svg"
      alt="The State Of JavaScript"
    />
  )
}

export default StateOfJavaScript2019
