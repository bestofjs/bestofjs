import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import fromNow from '../../../helpers/fromNow';

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
  renderEditButton(review) {
    return (
      <Link
        to={`/projects/${review.project}/reviews/${review.id}/edit`}
        style={{ marginLeft: 5 }}
      >
        <span className={`octicon octicon-pencil`}></span>
        {' '}
        EDIT
      </Link>
    );
  },
  render() {
    const { review, editable } = this.props;
    const getDate = item => item.updatedAt ? item.updatedAt : item.createdAt;
    return (
      <div className="project-review-item">
        <div className="project-review-date">
          <span className={`octicon octicon-person`}></span>
          {' '}
          { review.createdBy }
          <span className={`octicon octicon-calendar`} style={{ marginLeft: 10 }}></span>
          {' '}
          { review.updatedAt && 'Updated '}
          { fromNow(getDate(review)) }
          { editable && this.renderEditButton(review) }
        </div>
        <div className="score-bar readonly">
          {[1, 2, 3, 4, 5].map(i =>
            <span
              key={i}
              className={`octicon octicon-heart icon ${i <= review.score ? 'on' : 'off'}`}
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
