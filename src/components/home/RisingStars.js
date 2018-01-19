import React from 'react'

import fromNow from '../../helpers/fromNow'

const urls = {
  site: 'https://risingstars.js.org'
}

const RisingStars = ({ date }) => (
  <div id="stateofjs-container">
    <div>
      <p>
        <span
          className="mega-octicon octicon-megaphone"
          style={{ color: '#fa9e59' }}
        />{' '}
        <span style={{ fontSize: '1.5rem' }}>Rising Stars 2017</span>
        <span
          className="counter"
          style={{ fontSize: '1rem', color: '#aaa', marginLeft: '.5rem' }}
        >
          {fromNow(date)}
        </span>
      </p>
      <p>What was the most popular JavaScript project on GitHub in 2017?</p>
      <p>
        We have just published the{' '}
        <a href={urls.site} target="_blank">
          2017 JavaScript Rising Stars
        </a>
        {'! '}
      </p>
      <p>A complete overview of the JavaScript landscape in 2017.</p>
      <p>Available in English, Chinese, French and Spanish.</p>
    </div>
    <div id="stateofjs-logo-cell">
      <a href={urls.site}>
        <img
          id="stateofjs-logo"
          src="/images/risingstars2017.png"
          alt="JavaScript Rising Stars"
        />
      </a>
    </div>
  </div>
)

export default RisingStars
