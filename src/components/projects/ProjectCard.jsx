import React from 'react'
import Link from 'react-router/lib/Link'

import TagLabel from '../tags/TagLabelCompact'
import Delta from '../common/utils/Delta'
import DeltaBar from '../common/utils/DeltaBar'
import Stars from '../common/utils/Stars'
import Description from '../common/utils/Description'
import NpmSection from './NpmSection'

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
          <div className="header-ranking">
            { index + 1 }
          </div>

          <div className="header-name">
            { project.name }
          </div>

          <div className="header-stars">
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
        </header>

        { showDescription && (
          <section className="card-section">
            <Description text={ project.description } />
          </section>
        )}

      </Link>

      { showTags && (
        <section className="card-section tags-card-section">
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
        <NpmSection project={project} />
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
