import React, { PropTypes } from 'react';

import Header from '../ItemHeader';

const ProjectReview = React.createClass({
  propTypes: {
    review: PropTypes.object,
    project: PropTypes.object,
    editable: PropTypes.bool
  },
  renderComment(comment = '') {
    if (comment.trim() === '') {
      return (<span className="empty-value">(No comment)</span>);
    }
    return (
      <span>
        &ldquo;{' '}
        { comment }
        {' '}&rdquo;
      </span>
    );
  },
  render() {
    const { review, editable } = this.props;
    return (
      <div className="project-review-item">
        <Header
          item={ review }
          editable={ editable }
          editLinkTo={ `/projects/${review.project}/reviews/${review._id}/edit` }
        />
        <div className="score-bar readonly">
          {[1, 2, 3, 4, 5].map(i =>
            <span
              key={i}
              className={`octicon octicon-heart icon ${i <= review.rating ? 'on' : 'off'}`}
            >
            </span>
          )}
        </div>
        <div>
          {this.renderComment(review.comment)}
        </div>
      </div>
    );
  }
});
export default ProjectReview;
