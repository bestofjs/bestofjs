import React from 'react'
import styled from 'styled-components'

import fromNow from '../../../../../helpers/fromNow'

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
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://npm.im/legally"
        >
          <i>legally</i>
        </a>{' '}
        {fromNow(date)}.
      </p>
      <p>
        Find more information about licenses on{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://tldrlegal.com/"
        >
          <i>TL;DR Legal</i>
        </a>{' '}
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
      </a>, thank you!
    </p>
  </div>
)

export default Credits
