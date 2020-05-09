import React from 'react'

import fromNow from '../../helpers/fromNow'

const urls = {
  site: 'https://stateofjs.com'
}

const Intro = ({ date }) => (
  <div id="stateofjs-container">
    <div>
      <p>
        <span className="mega-octicon octicon-megaphone icon-color" />{' '}
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
        The results were published {fromNow(date)}, thank you for your patience!
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
