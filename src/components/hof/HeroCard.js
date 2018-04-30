import React from 'react'
import styled from 'styled-components'
import numeral from 'numeral'

import CardProjectLabels from '../common/CardProjectLabels'
import formatUrl from '../../helpers/formatUrl'

const digits = value => (value > 1000 ? '0.0' : '0')

function followersComment(value) {
  if (value === 0) return "You don't need all these followers!"
  if (value < 10) return "That's better than nothing!"
  if (value < 100) return "That's not so bad!"
  if (value < 1000)
    return "That's pretty good, you could be a hall of famer too!"
  return "That's a lot of followers, you should be in this hall of fame!"
}
const bestofjsOrange = '#e65100'
const cardBorderColor = '#cbcbcb'
const textSecondaryColor = '#777'

const Card = styled.div`
  flex: 1;
  padding: 0;
  background-color: #fff;
  border: 1px solid ${cardBorderColor};
  .card-block {
    display: flex;
    align-items: center;
    color: inherit;
    flex: 1;
  }
  .card-block:hover {
    text-decoration: none;
    color: inherited;
    background-color: #fff7eb;
    color: #000;
  }
  .header {
    display: flex;
    align-items: center;
  }
  .header-text {
    padding: 0 1em;
  }
  .hero-card.current-user .header {
    background-color: ${bestofjsOrange};
    color: #fff;
  }
  .hero-card.current-user .header .text-secondary {
    color: rgba(255, 255, 255, 0.6);
  }
  .name {
    font-size: 1.3em;
  }
  .inner {
    padding: 1rem;
    border-top: 1px dashed ${cardBorderColor};
    color: ${textSecondaryColor};
  }
  .icon {
    color: #fa9e59;
    margin-right: 5px;
  }
  .github-data {
    margin-top: 0.2em;
  }
`

const HeroCard = ({ hero, you, isCurrentUser, showDetails }) => {
  return (
    <Card className={`hero-card${isCurrentUser ? ' current-user' : ''}`}>
      <a
        className="header card-block"
        target="_blank"
        href={`https://github.com/${hero.username}`}
        data-balloon={`Open ${hero.username}'s profile on GitHub`}
      >
        <img
          src={`${hero.avatar}&s=150`}
          width="100"
          height="100"
          alt={hero.username}
        />
        <div className="header-text">
          <div className="name">
            {hero.name}
            {isCurrentUser && (
              <span style={{ color: 'rgba(255,255,255,.6)' }}> (You)</span>
            )}
          </div>
          {hero.username && (
            <div className="github-data">
              <div>
                <span className="text-secondary">{hero.username}</span>
                <div className="text-secondary">
                  {numeral(hero.followers).format(
                    `${digits(hero.followers)} a`
                  )}{' '}
                  followers{' '}
                  {you && (
                    <span style={{ color: '#aaa', fontSize: 14 }}>
                      ({followersComment(hero.followers)})
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </a>
      {showDetails &&
        hero.projects.length > 0 && (
          <CardProjectLabels projects={hero.projects} />
        )}
      {showDetails && hero.bio && <div className="inner">{hero.bio}</div>}
      {showDetails &&
        hero.blog && (
          <a
            className="inner card-block"
            target="_blank"
            data-balloon={`Open ${hero.username}'s website/blog`}
            href={hero.blog}
          >
            <span className="mega-octicon octicon-globe icon" />
            <span>{formatUrl(hero.blog)}</span>
          </a>
        )}
      {showDetails &&
        hero.modules > 0 && (
          <a
            className="inner card-block"
            target="_blank"
            data-balloon={`Open ${hero.username}'s profile on npm`}
            href={`https://www.npmjs.com/~${hero.npm || hero.username}`}
          >
            <span className="mega-octicon octicon-package icon" />
            <span>{hero.modules} modules on npm</span>
          </a>
        )}
    </Card>
  )
}

export default HeroCard
