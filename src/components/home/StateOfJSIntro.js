import React from 'react'

import fromNow from '../../helpers/fromNow'

const urls = {
  site: 'http://stateofjs.com',
  event:
    'https://medium.com/@sachagreif/announcing-the-stateofjs-2017-launch-livestream-14e4aeeeec3a'
}

const Intro = ({ date }) => (
  <div id="stateofjs-container">
    <div>
      <p>
        <span
          className="mega-octicon octicon-megaphone"
          style={{ color: '#fa9e59' }}
        />{' '}
        <span style={{ fontSize: '1.5rem' }}>
          State of JavaScript 2017 Results
        </span>
        <span
          className="counter"
          style={{ fontSize: '1rem', color: '#aaa', marginLeft: '.5rem' }}
        >
          {fromNow(date)}
        </span>
      </p>
      <p>
        More than 23,000 developers replied to{' '}
        <a href={urls.site} target="_blank">
          The State of JavaScript
        </a>{' '}
        survey.
      </p>
      <p>
        The results will be published {fromNow(date)}, thank you for your
        patience!
      </p>
      <p>
        Join the{' '}
        <a href={urls.event} target="_blank">
          Launch Livestream
        </a>{' '}
        on December 12 for a look at the survey results, Q&A sessions, and more
        with special guests!
      </p>
    </div>
    <div id="stateofjs-logo-cell">
      <a href={urls.site}>
        <img
          id="stateofjs-logo"
          src="/images/stateofjs2017.png"
          alt="The State of JavaScript"
        />
      </a>
    </div>
  </div>
)

export default Intro
