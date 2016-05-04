import React from 'react'
import numeral from 'numeral'

import CardProjectLabels from '../common/CardProjectLabels'

const getAvatarURL = (hero) => (
  hero.avatar ? `${hero.avatar}&s=150` : 'svg/square-logo.svg'
)
const digits = (value) => (value > 1000) ? '0.0' : '0'

export default ({ hero }) => (
  <div className="hero-card">
    <a className="header card-block" href={`https://github.com/${hero.username}`} target="_blank">
      <img src={getAvatarURL(hero)} width="100" />
      <div className="header-text">
        <div className="name">{hero.name}</div>
        {hero.username && (
          <div className="item">
            <span className="octicon octicon-mark-github"></span>
            {' '}
            {hero.username}
            {' '}
            {hero.followers > 0 && (
              <div>
                {numeral(hero.followers).format(`${digits(hero.followers)} a`)} followers
              </div>
            )}
          </div>
        )}
      </div>
    </a>
    {hero.projects.length > 0 && <CardProjectLabels
      projects={hero.projects}
    />}
    {hero.bio && (
      <div className="inner">
        {hero.bio}
      </div>
    )}
  </div>
)
