import React from 'react'
import PropTypes from 'prop-types'

import Header from '../ItemHeader'
import Div from './ScoreBar'
import MarkdownReadonly from '../../common/form/MarkdownReadonly'

const ProjectReview = ({ project, review, editable }) => {
  return (
    <div className="project-review-item">
      <Header
        item={review}
        editable={editable}
        editLinkTo={`/projects/${project.slug}/reviews/${review._id}/edit`}
      />
      <Div className="score-bar readonly">
        {[1, 2, 3, 4, 5].map(i => (
          <span
            key={i}
            className={`octicon octicon-heart icon ${
              i <= review.rating ? 'on' : 'off'
            }`}
          />
        ))}
      </Div>
      {review.comment && (
        <div className="project-item-comment">
          <MarkdownReadonly comment={review.comment} />
        </div>
      )}
    </div>
  )
}

ProjectReview.propTypes = {
  review: PropTypes.object,
  editable: PropTypes.bool
}

export default ProjectReview
