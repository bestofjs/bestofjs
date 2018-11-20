import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Logo from './Logo'
import fromNow from '../../../helpers/fromNow'
import SectionHeader from '../../common/SectionHeader'
import ExternalLink from '../../common/ExternalLink'

const urls = {
  site: 'https://2018.stateofjs.com/'
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
        <SectionHeader icon="megaphone">
          <SectionHeader.Title>State of JavaScript 2018</SectionHeader.Title>
          <SectionHeader.SubTitle>
            Published {fromNow(date)}
          </SectionHeader.SubTitle>
        </SectionHeader>
        <p>
          The results for the{' '}
          <ExternalLink url={urls.site}>2018 State of JavaScript</ExternalLink>{' '}
          survey have been published!
        </p>
        <p>
          Go and check the answers of more than 20,000 developers about the
          technologies they use or want to use.
        </p>
      </div>
      <LogoCell>
        <ExternalLink url={urls.site}>
          <Logo />
        </ExternalLink>
      </LogoCell>
    </Grid>
  )
}

StateOfJavaScript2018.propTypes = {
  date: PropTypes.objectOf(Date).isRequired
}

export default StateOfJavaScript2018
