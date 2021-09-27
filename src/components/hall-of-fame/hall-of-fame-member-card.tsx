import React from 'react'
import styled from '@emotion/styled'
import numeral from 'numeral'
import { GoGlobe, GoPackage } from 'react-icons/go'

import formatUrl from 'helpers/url'
import { ExternalLink } from 'components/core/typography'
import { CardProjectLabels } from './card-project-labels'

const digits = (value) => (value > 1000 ? '0.0' : '0')

export const HeroCard = ({ hero, showDetails }) => {
  return (
    <Card className={`hero-card`}>
      <ExternalLink
        className="header card-block hint--top"
        url={`https://github.com/${hero.username}`}
        aria-label={`Open ${hero.username}'s profile on GitHub`}
        _hover={{
          textDecoration: 'none'
        }}
      >
        <img
          src={`${hero.avatar}&s=150`}
          width="100"
          height="100"
          alt={hero.username}
        />
        <div className="header-text">
          <div className="name">{hero.name}</div>
          {hero.username && (
            <div className="github-data">
              <div>
                <span className="text-secondary">{hero.username}</span>
                <div className="text-secondary">
                  {numeral(hero.followers).format(
                    `${digits(hero.followers)} a`
                  )}{' '}
                  followers{' '}
                </div>
              </div>
            </div>
          )}
        </div>
      </ExternalLink>
      {showDetails && hero.projects.length > 0 && (
        <CardProjectLabels projects={hero.projects} />
      )}
      {showDetails && hero.bio && <div className="inner">{hero.bio}</div>}
      {showDetails && hero.blog && (
        <ExternalLink
          className="inner card-block hint--top"
          aria-label={`Open ${hero.username}'s website/blog`}
          url={hero.blog}
        >
          <GoGlobe size={24} className="icon" />
          <span>{formatUrl(hero.blog)}</span>
        </ExternalLink>
      )}
      {showDetails && hero.modules > 0 && (
        <ExternalLink
          className="inner card-block hint--top"
          aria-label={`Open ${hero.username}'s profile on npm`}
          url={`https://www.npmjs.com/~${hero.npm || hero.username}`}
        >
          <GoPackage size={24} className="icon" />
          <span>{hero.modules} modules on npm</span>
        </ExternalLink>
      )}
    </Card>
  )
}

const Card = styled.div`
  flex: 1;
  padding: 0;
  background-color: var(--cardBackgroundColor);
  border: 1px solid var(--boxBorderColor);
  .card-block {
    display: flex;
    align-items: center;
    color: inherit;
    flex: 1;
  }
  // .card-block:hover {
  //   text-decoration: none;
  //   color: inherited;
  //   background-color: #fff7eb;
  //   color: #000;
  // }
  .header {
    display: flex;
    align-items: center;
  }
  .header-text {
    padding: 0 1em;
  }
  .name {
    font-size: 1.3em;
  }
  .inner {
    padding: 1rem;
    border-top: 1px dashed var(--boxBorderColor);
  }
  .icon {
    color: var(--iconColor);
    margin-right: 5px;
  }
  .github-data {
    margin-top: 0.2em;
  }
`

// function followersComment(value) {
//   if (value === 0) return "You don't need all these followers!"
//   if (value < 10) return "That's better than nothing!"
//   if (value < 100) return "That's not so bad!"
//   if (value < 1000)
//     return "That's pretty good, you could be a hall of famer too!"
//   return "That's a lot of followers, you should be in this hall of fame!"
// }
