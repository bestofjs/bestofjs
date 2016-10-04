import React from 'react'
import Link from 'react-router/lib/Link'

import Description from '../common/utils/Description'
import Delta from '../common/utils/Delta'
import Stars from '../common/utils/Stars'
import TagLabel from '../tags/TagLabelCompact'
import ProjectAvatar from '../common/ProjectAvatar'

const ProjectTableView = ({ title, comment, icon, projects, showStars, showDelta, deltaFilter }) => (
  <div className="project-table">
    <div className="project-table-header">
      <div className="icon">
        <span className={`mega-octicon ${icon}`} />
      </div>
      <div className="main-part">
        <div className="title">{title}</div>
        <div className="comment">{comment}</div>
      </div>
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
  <div className="project-table-row">
    <Link className="link" to={`/projects/${project.slug}`}>
      <div className="avatar-section">
        <ProjectAvatar project={project} size={75} />
        <div className="project-title">{project.name}</div>
        <div className="big-numbers">
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
                color={false}
                icon
                perDay={deltaFilter !== 'total' && deltaFilter !== 'daily'}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
    {showDescription && (
      <div className="description-section text-secondary">
        <Description text={project.description} />
      </div>)
    }
    <div className="inner tags-section">
      {project.tags.map(tag =>
        <TagLabel tag={tag} key={project.id + tag.id} />
      )}
    </div>
  </div>
)

export default ProjectTableView
