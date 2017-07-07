import React from 'react'

const AnonymousHero = ({ onLogin }) => (
  <div className="hero-card">
    <div className="header card-block1">
      <img src="/svg/square-logo.svg" width="100" height="100" alt="logo" />
      <div className="header-text">
        <p>Who will be the next one...</p>
        <div className="name">Maybe you?</div>
      </div>
    </div>
    <div className="inner" style={{ textAlign: 'center' }}>
      <p>To be in good company...</p>
      <button className="ui btn" onClick={onLogin}>
        <span className="octicon octicon-mark-github" />
        {' '}
        Sign in with GitHub
      </button>
    </div>
  </div>
)

export default AnonymousHero
