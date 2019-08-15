import React from 'react'
import { Link } from 'react-router-dom'
import numeral from 'numeral'
import styled from 'styled-components'

import TagLabelGroup from '../tags/TagLabelGroup'
import StarDelta from '../common/utils/StarDelta'
import StarTotal from '../common/utils/StarTotal'
import Description from '../common/utils/Description'
import NpmCardSection from './NpmCardSection'
import CardFooter from './CardFooter'
import Avatar from '../common/ProjectAvatar'
import Section from './ProjectCardSection'
import { getDeltaByDay } from '../../selectors/project'

import fromNow from '../../helpers/fromNow'

const formatNumber = number => numeral(number).format('0,0')

const cardBorderColor = '#cbcbcb'

const Div = styled.div`
  width: 100%;
  padding: 0;
  background-color: #fff;
  vertical-align: top;
  border: 1px solid ${cardBorderColor};
  header {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    height: 75px;
  }
  .header-ranking {
    margin-left: -10px;
    letter-spacing: -10px;
    text-align: center;
    background-color: #00f;
    color: #fff;
    font-size: 4em;
    line-height: 1;
    width: 60px;
  }
  .header-name {
    flex-grow: 1;
    text-align: center;
  }
  .stars-bar {
    height: 3px;
    background-color: #ffe082;
  }
  .inner {
    padding: 1em;
  }
  .inner.github {
    border-top: 1px dashed ${cardBorderColor};
  }
  .star-delta,
  .total {
    text-align: center;
    margin-right: 0.5rem;
  }
  .title {
    font-size: 1.2em;
    margin-bottom: 5px;
    z-index: 2;
    position: relative;
    display: block;
    text-align: center;
  }
  .big-numbers {
    float: right;
  }
  .big-numbers .total {
    font-size: 1.2em;
  }
  .octicon {
    text-align: left;
  }
  .url {
    display: block;
    margin-top: 1em;
  }
  .star-added {
    margin: 0 0 1em;
  }
`

const BlockLink = styled(Link)`
  display: block;
  color: var(--textPrimaryColor);
  :hover {
    text-decoration: none;
    color: inherited;
    background-color: #fff7eb;
    color: #000;
  }
`

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
    <Div className="project-card">
      <BlockLink to={path} className="card-block">
        <header>
          {showAvatar ? (
            <Avatar project={project} size={75} />
          ) : (
            <div className="header-ranking">{index + 1}</div>
          )}

          <div className="header-name">{project.name}</div>

          <div className="header-stars">
            {showStars && (
              <div className="total">
                <StarTotal value={project.stars} icon />
              </div>
            )}

            {showDelta && (
              <div className="delta">
                <StarDelta
                  value={getDeltaByDay(deltaFilter)(project)}
                  average={deltaFilter !== 'daily'}
                />
              </div>
            )}
          </div>
        </header>

        {viewOptions.description && (
          <Section className="description-card-section">
            <Description text={project.description} showEmojis={false} />
          </Section>
        )}
      </BlockLink>

      {showTags && (
        <Section className="tags-card-section">
          <TagLabelGroup tags={project.tags} />
        </Section>
      )}

      {showMetrics && project.npm && (
        <NpmCardSection
          project={project}
          packagequality={viewOptions.packagequality}
          npms={viewOptions.npms}
        />
      )}

      {viewOptions.commit && (
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
        </div>
      )}

      {isLoggedin && (
        <CardFooter
          belongsToMyProjects={project.belongsToMyProjects}
          onAdd={handleAddToMyProjects}
          onRemove={handleRemoveFromMyProjects}
          pending={project.pending}
        />
      )}
    </Div>
  )
}

export default ProjectCard
