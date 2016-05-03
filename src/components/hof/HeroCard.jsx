import React from 'react'
import numeral from 'numeral'

import CardProjectLabels from '../common/CardProjectLabels'

export default ({ hero }) => (
  <div className="hero-card">
    <a className="header card-block" href={`https://github.com/${hero.username}`} target="_blank">
      <img src={hero.avatar} width="100" />
      <div className="header-text">
        <div className="name">{hero.name}</div>
        {false && <div className="login">{hero.username}</div>}
        <div className="item">
          <span className="octicon octicon-mark-github"></span>
          {' '}
          {hero.username}
          {' '}
          <div>{numeral(hero.followers).format('0.0 a')} followers</div>
        </div>
      </div>
    </a>
    <CardProjectLabels
      projects={hero.projects}
    />
  </div>
)
