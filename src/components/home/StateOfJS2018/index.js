import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Logo from './Logo'
import fromNow from '../../../helpers/fromNow'
import SectionHeader from '../../common/SectionHeader'

const urls = {
  site: 'https://stateofjs.com'
}

const breakPoint = 900

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  > div {
    flex: 0 0 50%;
  }
  @media (max-width: ${breakPoint - 1}px) {
    flex-direction: column;
    > div {
    }
  }
`

const LogoCell = styled.div`
  @media (max-width: ${breakPoint - 1}px) {
    margin-top: 2rem;
  }
`

const StateOfJavaScript2018 = ({ date }) => {
  return (
    <Grid>
      <div>
        <SectionHeader>
          <SectionHeader.Title>State of JavaScript 2018</SectionHeader.Title>
          <SectionHeader.SubTitle>
            Published {fromNow(date)}
          </SectionHeader.SubTitle>
        </SectionHeader>
        <p>
          We need your input about the{' '}
          <a href={urls.site} target="_blank">
            The State of JavaScript 2018
          </a>.
        </p>
        <p>
          Go take the annual survey, tell us about the libraries you use, and
          help us identify the latest trends in the JavaScript ecosystem.
        </p>
      </div>
      <LogoCell>
        <a href={urls.site} target="_blank">
          <Logo />
        </a>
      </LogoCell>
    </Grid>
  )
}

StateOfJavaScript2018.propTypes = {
  date: PropTypes.objectOf(Date).isRequired
}

export default StateOfJavaScript2018
