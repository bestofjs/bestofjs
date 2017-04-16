import React from 'react'
import PropTypes from 'prop-types'
import marked from 'marked'

import Header from '../ItemHeader'

const ProjectLink = React.createClass({
  propTypes: {
    link: PropTypes.object.isRequired
  },
  renderComment (comment) {
    if (!comment || comment.trim() === '') {
      return (<span className="empty-value">(No comment)</span>)
    }
    return (
      <div dangerouslySetInnerHTML={{ __html: marked(comment) }} />
    )
  },
  render () {
    const { link, project, editable } = this.props
    return (
      <div className="project-link">
        <Header
          item={link}
          editable={editable}
          editLinkTo={`/projects/${project.slug}/links/${link._id}/edit`}
        />
        <a href={link.url} target="_blank" className="project-link-title">
          {link.title}
          {' '}
          <span className="octicon octicon-link-external" />
        </a>
        {link.comment && <div className="project-item-comment" style={{ marginTop: '0.5em' }}>
          {this.renderComment(link.comment)}
        </div>}
      </div>
    )
  }
})
export default ProjectLink
