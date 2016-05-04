import React from 'react'
import numeral from 'numeral'

import CardProjectLabels from '../common/CardProjectLabels'

const digits = (value) => (value > 1000) ? '0.0' : '0'

function followersComment(value) {
  if (value === 0) return `you don't need all these followers!`
  if (value < 10) return `that's better than nothing!`
  if (value < 100) return `that's not so bad!`
  if (value < 1000) return `that's pretty good, you could be a hall of famer too!`
  return `that's a lot of followers, you should be in this hall of fame!`
}

export default ({ hero, you }) => (
  <div className="hero-card">
    <a className="header card-block" href={`https://github.com/${hero.username}`} target="_blank">
      <img src={`${hero.avatar}&s=150`} width="100" height="100" alt={hero.username} />
      <div className="header-text">
        <div className="name">{hero.name}</div>
        {hero.username && (
          <div className="item">
            <span className="octicon octicon-mark-github"></span>
            {' '}
            {hero.username}
            <div>
              {numeral(hero.followers).format(`${digits(hero.followers)} a`)} followers
              {' '}
              {you && <span style={{ color: '#aaa', fontSize: 14 }}>
                ({followersComment(hero.followers)})
              </span>}
            </div>
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
