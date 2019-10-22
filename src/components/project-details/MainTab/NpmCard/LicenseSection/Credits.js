import React from 'react'
import styled from 'styled-components'

import fromNow from '../../../../../helpers/fromNow'
import { ExternalLink } from '../../../../core/typography'

const Div = styled.div`
  margin: 1rem 0px 0px;
  padding-left: 1rem;
  border-left: 1px dashed #cbcbcb;
  font-size: 14px;
`

const Credits = ({ date }) => {
  return (
    <Div>
      <p>
        The package and <b>all</b> its dependencies have been scanned using{' '}
        <ExternalLink url="https://npm.im/legally">
          <i>legally</i>
        </ExternalLink>{' '}
        {fromNow(date)}.
      </p>
      <p>
        Find more information about licenses on{' '}
        <ExternalLink url="https://tldrlegal.com/">
          <i>TL;DR Legal</i>
        </ExternalLink>{' '}
        site.
      </p>
      <Feedback />
    </Div>
  )
}

const Feedback = () => (
  <div>
    <p>
      What do you think of this "<i>All Licenses</i>"" new feature... useful?
      useless?{' '}
    </p>
    <p>
      Give us feedback on{' '}
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/bestofjs/bestofjs-webui/issues/53"
      >
        GitHub
      </a>
      , thank you!
    </p>
  </div>
)

export default Credits
