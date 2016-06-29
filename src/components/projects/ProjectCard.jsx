import React from 'react'
import Link from 'react-router/lib/Link'

import TagLabel from '../tags/TagLabelCompact'
import Delta from '../common/utils/Delta'
import DeltaBar from '../common/utils/DeltaBar'
import Stars from '../common/utils/Stars'
import Description from '../common/utils/Description'

import fromNow from '../../helpers/fromNow'

const renderReviews = (reviews = []) => {
  const count = reviews.length
  const text = (count === 1) ? 'One review' : `${count} reviews`
  return (
    <section>
      <span className="octicon octicon-heart"></span>
      {text}
    </section>
  )
}

const renderLinks = (links = []) => {
  const count = links.length
  const text = (count === 1) ? (
    `one link: ${links[0].title}`
  ) : (
    `${count} links:`
  )
  const list = () => (
    <ul>
      {links.map(link => (
        <li key={link._id}>{link.title}</li>
      ))}
    </ul>
  )
  return (
    <section>
      <span className="octicon octicon-link"></span>
      {text}
      {count > 1 && list()}
    </section>
  )
}

const ProjectCard = (
  {
    project,
    index,
    deltaFilter = 'total',
    showStars,
    showDelta,
    showDescription = true,
    showTags,
    showMetrics
  }) => {
  const path = `/projects/${project.slug}`
  return (
    <div className="project-card">
      <Link
        to={ path }
        className="card-block"
      >
        <header>
          <div className="ranking">
            { index + 1 }
          </div>

          <div className="big-numbers">
            { showStars && (
              <div className="total">
                <Stars
                  value={ project.stars }
                  icon
                />
              </div>
            ) }

            { showDelta && project.deltas.length > 0 && (
              <div className="delta">
                <Delta
                  value={ project.stats[deltaFilter] }
                  big
                  perDay={deltaFilter !== 'total' && deltaFilter !== 'daily' }
                />
              </div>
            ) }
          </div>
          <div className="title">
            { project.name }
          </div>
        </header>

        { showDescription && (
          <section>
            <Description text={ project.description } />
          </section>
        )}

      </Link>

      { showTags && (
        <section className="tags-section">
          { project.tags.map(tag =>
            <TagLabel tag={ tag } key={ project.id + tag.id } />
          ) }
        </section>
      )}

      {showMetrics && project.reviews &&
        <Link
          className="card-block"
          to={`${path}/reviews`}
        >
          {renderReviews(project.reviews)}
        </Link>
      }

      {showMetrics && project.links &&
        <Link
          className="card-block"
          to={`${path}/links`}
        >
          {renderLinks(project.links)}
        </Link>
      }

      {showMetrics && project.npm &&
        <section className="npm">
          <a
            data-balloon="View on npm"
            className="inner card-block npm-link"
            href={`http://npm.im/${project.npm}`}
          >
            <img
              className="npm-logo"
              width="16" height="16"
              src="https://www.npmjs.com/static/images/touch-icons/favicon-16x16.png"
            />
            {project.npm}
            <span className="version">
              {project.version}
            </span>
          </a>
          <a
            className="inner card-block quality-link"
            data-balloon="View on packagequality.com"
            href={`http://packagequality.com/#?package=${project.npm}`}
          >
            <img
              className="quality-logo"
              width="16" height="16"
              src="http://packagequality.com/favicon.ico"
            />
            score {project.quality}%
          </a>
        </section>
      }

      {showMetrics && <div className="inner github">
        <div className="last-commit">
          <span className="octicon octicon-git-commit"></span>
          {' '}
          <span data-balloon="Last update">{ fromNow(project.pushed_at) }</span>
        </div>
      </div>}

      {false && showMetrics && project.deltas.length > 0 &&
        <DeltaBar data={ project.deltas.slice(0, 7) } />
      }
    </div>
  )
}

export default ProjectCard
