import React from 'react'
import { Link } from 'react-router-dom'

import TagLabel from '../tags/TagLabelCompact'
import Delta from '../common/utils/Delta'
import DeltaBar from '../common/utils/DeltaBar'
import Stars from '../common/utils/Stars'
import Description from '../common/utils/Description'
import NpmSection from './NpmSection'
import Avatar from '../common/ProjectAvatar'

import fromNow from '../../helpers/fromNow'

const renderReviews = (reviews = []) => {
  const count = reviews.length
  const text = (count === 1) ? 'One review' : `${count} reviews`
  return (
    <section className="card-section">
      <span className="octicon octicon-heart" />
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
    <section className="card-section">
      <span className="octicon octicon-link" />
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
    showTags,
    showMetrics,
    viewOptions = {},
    showAvatar = true,
    showLinks = false,
    showReviews = false
  }) => {
  const path = `/projects/${project.slug}`
  return (
    <div className="project-card">
      <Link
        to={path}
        className="card-block"
      >
        <header>
          {showAvatar ? (
            <Avatar project={project} size={75} />
          ) : (
            <div className="header-ranking">
              {index + 1}
            </div>
          )}

          <div className="header-name">
            {project.name}
          </div>

          <div className="header-stars">
            {showStars && (
              <div className="total">
                <Stars
                  value={project.stars}
                  icon
                />
              </div>
            )}

            {showDelta && project.deltas.length > 0 && (
              <div className="delta">
                <Delta
                  value={project.stats[deltaFilter]}
                  big
                  icon
                  perDay={deltaFilter !== 'total' && deltaFilter !== 'daily'}
                />
              </div>
            )}
          </div>
        </header>

        {viewOptions.description && (
          <section className="card-section description-card-section">
            <Description text={project.description} />
          </section>
        )}

      </Link>

      {showTags && (
        <section className="card-section tags-card-section">
          {project.tags.map(tag =>
            <TagLabel tag={tag} key={`${project.slug}-${tag.id}`} />
          )}
        </section>
      )}

      {showReviews && project.reviews &&
        <Link
          className="card-block"
          to={`${path}/reviews`}
        >
          {renderReviews(project.reviews)}
        </Link>
      }

      {showLinks && project.links &&
        <Link
          className="card-block"
          to={`${path}/links`}
        >
          {renderLinks(project.links)}
        </Link>
      }

      {showMetrics && project.npm &&
        <NpmSection
          project={project}
          packagequality={viewOptions.packagequality}
          npms={viewOptions.npms}
        />
      }

      {viewOptions.commit && <div className="inner github">
        <div className="last-commit">
          <span className="octicon octicon-git-commit" />
          {' '}
          <span data-balloon="Last update">{fromNow(project.pushed_at)}</span>
        </div>
      </div>}
    </div>
  )
}

export default ProjectCard
