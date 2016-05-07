import React from 'react'
import numeral from 'numeral'

import CardProjectLabels from '../common/CardProjectLabels'
import formatUrl from '../../helpers/formatUrl'

const digits = (value) => (value > 1000) ? '0.0' : '0'

function followersComment(value) {
  if (value === 0) return `you don't need all these followers!`
  if (value < 10) return `that's better than nothing!`
  if (value < 100) return `that's not so bad!`
  if (value < 1000) return `that's pretty good, you could be a hall of famer too!`
  return `that's a lot of followers, you should be in this hall of fame!`
}

export default ({ hero, you, isCurrentUser }) => (
  <div className={`hero-card${isCurrentUser ? ' current-user' : ''}`}>
    <a className="header card-block" target="_blank"
      href={`https://github.com/${hero.username}`}
      title={`${hero.username} Github profile`}
    >
      <img src={`${hero.avatar}&s=150`} width="100" height="100" alt={hero.username} />
      <div className="header-text">
        <div className="name">
          {hero.name}
          {isCurrentUser && (
            <span style={{ color: 'rgba(255,255,255,.6)' }}> (You)</span>
          )}
        </div>
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
    {hero.blog && (
      <a
        className="inner card-block" target="_blank"
        href={hero.blog}
      >
        <span className="mega-octicon octicon-globe icon"></span>
        <span>{formatUrl(hero.blog)}</span>
      </a>
    )}
    {hero.modules > 0 && (
      <a
        className="inner card-block" target="_blank"
        title={`${hero.username}'s blog'`}
        href={`https://www.npmjs.com/~${hero.username}`}
      >
        <span className="mega-octicon octicon-package icon"></span>
        <span>{hero.modules} modules on npm</span>
      </a>
    )}
  </div>
)
