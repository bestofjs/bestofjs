import React from 'react'

import fromNow from '../../helpers/fromNow'

const url = 'http://stateofjs.com/'

const Intro = ({ date }) =>
  <div>
    <div>
      <h1 className="with-comment" style={{ margin: '0 0 1rem' }}>
        The best of JavaScript, HTML and CSS
      </h1>
      <p>
        Check out the most popular open-source projects and the latest trends
        about the web platform and node.js.
      </p>
      <hr />
      <div>
        <p>
          <span
            className="mega-octicon octicon-megaphone"
            style={{ color: '#fa9e59' }}
          />{' '}
          <span style={{ fontSize: '1.5rem' }}>Coming Soon...</span>
          <span
            className="counter"
            style={{ fontSize: '1rem', color: '#aaa', marginLeft: '.5rem' }}
          >
            {fromNow(date)}
          </span>
        </p>
        <p>
          More than 23,000 developers replied to{' '}
          <a href={url} target="_blank" rel="noopener noreferrer">
            The State of JavaScript
          </a>{' '}
          survey.
        </p>
        <p>Thank you to all... the results are coming soon!</p>
      </div>
    </div>
  </div>

export default Intro
