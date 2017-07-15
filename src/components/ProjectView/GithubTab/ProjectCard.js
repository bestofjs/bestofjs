import React from 'react'

import Description from '../../common/utils/Description'
import DeltaBar from '../../common/utils/DeltaBar'
import fromNow from '../../../helpers/fromNow'

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <div className="inner">
        <p>
          <Description text={project.description} />
        </p>
        {project.url &&
          <p>
            <span className="octicon octicon-globe" />
            Website: <a href={project.url}>{project.url}</a>
          </p>}
      </div>
      <div
        className="inner github"
        style={{ borderTop: '1px solid #ddd', paddingBottom: 0 }}
      >
        <p>
          <span className="octicon octicon-mark-github" /> GitHub:{' '}
          <a href={project.repository}>{project.repository}</a> {project.stars}{' '}
          <span className="octicon octicon-star" />
        </p>
        <div className="last-commit">
          <span className="octicon octicon-git-commit" /> Last update:{' '}
          {fromNow(project.pushed_at)}
        </div>
        <div>
          {project.deltas.length > 0 &&
            <DeltaBar data={project.deltas.slice(0, 7)} />}
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
