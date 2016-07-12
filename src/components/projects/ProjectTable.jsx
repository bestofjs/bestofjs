import React from 'react'
import Link from 'react-router/lib/Link'

import Description from '../common/utils/Description'
import Delta from '../common/utils/Delta'
import Stars from '../common/utils/Stars'
import TagLabel from '../tags/TagLabelCompact'

const ProjectTableView = ({ projects, children, showStars, showDelta, deltaFilter }) => (
  <div className="card card-homepage">
    <div className="card-row">
      { children }
    </div>
    {projects.map(project => (
      <ProjectTableView.Row
        key={project.slug}
        project={project}
        showStars={showStars}
        showDelta={showDelta}
        deltaFilter={deltaFilter}
      />
    ))}
  </div>
)

ProjectTableView.Row = ({ project, showStars, showDelta, deltaFilter, showDescription = true }) => (
  <div className="card-row">
    <Link className="inner link" to={`/projects/${project.slug}`}>
      <div>
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
                color={false}
                icon
                perDay={deltaFilter !== 'total' && deltaFilter !== 'daily' }
              />
            </div>
          ) }
        </div>
        <div className="title-section">{ project.name }</div>
      </div>
      {showDescription && (
        <div className="description-section text-secondary">
          <Description text={project.description} />
        </div>)
      }
    </Link>
    <div className="inner tags-section">
      {project.tags.map(tag =>
        <TagLabel tag={tag} key={ project.id + tag.id } />
      )}
    </div>
  </div>
)

export default ProjectTableView
