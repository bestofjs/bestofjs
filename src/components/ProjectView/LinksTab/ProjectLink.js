import React from 'react'
import PropTypes from 'prop-types'

import MarkdownReadonly from '../../common/form/MarkdownReadonly'
import Header from '../ItemHeader'

const ProjectLink = ({ link, project, editable }) => {
  return (
    <div className="project-link">
      <Header
        item={link}
        editable={editable}
        editLinkTo={`/projects/${project.slug}/links/${link._id}/edit`}
      />
      <a href={link.url} target="_blank" className="project-link-title">
        {link.title} <span className="octicon octicon-link-external" />
      </a>
      {link.comment && (
        <div className="project-item-comment" style={{ marginTop: '0.5em' }}>
          <MarkdownReadonly comment={link.comment} />
        </div>
      )}
    </div>
  )
}

ProjectLink.propTypes = {
  link: PropTypes.object.isRequired
}

export default ProjectLink
