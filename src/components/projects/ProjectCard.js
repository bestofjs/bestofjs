import React from 'react'
import { Link } from 'react-router-dom'
import numeral from 'numeral'

import TagLabel from '../tags/TagLabelCompact'
import Delta from '../common/utils/Delta'
import StarDelta from '../common/utils/StarDelta'
import StarTotal from '../common/utils/StarTotal'
import Description from '../common/utils/Description'
import NpmCardSection from './NpmCardSection'
import CardFooter from './CardFooter'
import Avatar from '../common/ProjectAvatar'

import fromNow from '../../helpers/fromNow'

const formatNumber = number => numeral(number).format('0,0')

const renderReviews = (reviews = []) => {
  const count = reviews.length
  const text = count === 1 ? 'One review' : `${count} reviews`
  return (
    <section className="card-section">
      <span className="octicon octicon-heart" />
      {text}
    </section>
  )
}

const renderLinks = (links = []) => {
  const count = links.length
  const text = count === 1 ? `one link: ${links[0].title}` : `${count} links:`
  const list = () =>
    <ul>
      {links.map(link =>
        <li key={link._id}>
          {link.title}
        </li>
      )}
    </ul>
  return (
    <section className="card-section">
      <span className="octicon octicon-link" />
      {text}
      {count > 1 && list()}
    </section>
  )
}

const ProjectCard = ({
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
  showReviews = false,
  onAddToMyProjects,
  onRemoveFromMyProjects,
  isLoggedin
}) => {
  const path = `/projects/${project.slug}`
  const handleAddToMyProjects = () => onAddToMyProjects(project)
  const handleRemoveFromMyProjects = () => onRemoveFromMyProjects(project)
  return (
    <div className="project-card">
      <Link to={path} className="card-block">
        <header>
          {showAvatar
            ? <Avatar project={project} size={75} />
            : <div className="header-ranking">
                {index + 1}
              </div>}

          <div className="header-name">
            {project.name}
          </div>

          <div className="header-stars">
            {showStars &&
              <div className="total">
                <StarTotal value={project.stars} icon />
              </div>}

            {showDelta &&
              project.deltas.length > 0 &&
              <div className="delta">
                <StarDelta
                  value={project.stats[deltaFilter]}
                  average={deltaFilter !== 'daily'}
                />
                {false &&
                  <Delta
                    value={project.stats[deltaFilter]}
                    big
                    icon
                    color={false}
                    perDay={deltaFilter !== 'total' && deltaFilter !== 'daily'}
                  />}
              </div>}
          </div>
        </header>

        {viewOptions.description &&
          <section className="card-section description-card-section">
            <Description text={project.description} />
          </section>}
      </Link>

      {showTags &&
        <section className="card-section tags-card-section">
          {project.tags.map(tag =>
            <TagLabel tag={tag} key={`${project.slug}-${tag.id}`} />
          )}
        </section>}

      {showReviews &&
        project.reviews &&
        <Link className="card-block" to={`${path}/reviews`}>
          {renderReviews(project.reviews)}
        </Link>}

      {showLinks &&
        project.links &&
        <Link className="card-block" to={`${path}/links`}>
          {renderLinks(project.links)}
        </Link>}

      {showMetrics &&
        project.npm &&
        <NpmCardSection
          project={project}
          packagequality={viewOptions.packagequality}
          npms={viewOptions.npms}
        />}

      {viewOptions.commit &&
        <div className="inner github" style={{ display: 'flex' }}>
          <div className="last-commit" style={{ flex: '1' }}>
            <span className="octicon octicon-git-commit" />{' '}
            <span data-balloon="Last update">{fromNow(project.pushed_at)}</span>
          </div>
          <div>
            <span className="octicon octicon-organization" />{' '}
            <span data-balloon="Number of contributors">
              {formatNumber(project.contributor_count)}
            </span>
          </div>
        </div>}

      {isLoggedin &&
        <CardFooter
          belongsToMyProjects={project.belongsToMyProjects}
          onAdd={handleAddToMyProjects}
          onRemove={handleRemoveFromMyProjects}
          pending={project.pending}
        />}
    </div>
  )
}

export default ProjectCard
