import React from 'react'
import PropTypes from 'prop-types'
import marked from 'marked'

import Header from '../ItemHeader'

const Comment = ({ comment }) => {
  if (comment.trim() === '') {
    return <span className="empty-value">(No comment)</span>
  }
  return <div dangerouslySetInnerHTML={{ __html: marked(comment) }} />
}

const ProjectReview = ({ review, editable }) => {
  return (
    <div className="project-review-item">
      <Header
        item={review}
        editable={editable}
        editLinkTo={`/projects/${review.project}/reviews/${review._id}/edit`}
      />
      <div className="score-bar readonly">
        {[1, 2, 3, 4, 5].map(i =>
          <span
            key={i}
            className={`octicon octicon-heart icon ${i <= review.rating
              ? 'on'
              : 'off'}`}
          />
        )}
      </div>
      {review.comment &&
        <div className="project-item-comment">
          <Comment comment={review.comment} />
        </div>}
    </div>
  )
}

ProjectReview.propTypes = {
  review: PropTypes.object,
  editable: PropTypes.bool
}

export default ProjectReview
