import React from 'react'

import fromNow from '../../helpers/fromNow'

const url = 'http://stateofjs.com/'

const Intro = ({ date }) =>
  <div id="stateofjs-container">
    <div>
      <h1 className="with-comment" style={{ margin: '0 0 1rem' }}>
        The best of JavaScript
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
          <span style={{ fontSize: '1.5rem' }}>Breaking News</span>
          <span
            className="counter"
            style={{ fontSize: '1rem', color: '#aaa', marginLeft: '.5rem' }}
          >
            {fromNow(date)}
          </span>
        </p>
        <p>
          We need your input about the{' '}
          <a href={url} target="_blank" rel="noopener noreferrer">
            The State of JavaScript
          </a>!
        </p>
      </div>
    </div>
    <div id="stateofjs-logo-cell">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        alt="The State of JavaScript"
      >
        <img
          id="stateofjs-logo"
          src="https://stateofjs.netlify.com/images/javascript2017.svg"
        />
      </a>
    </div>
  </div>

export default Intro
