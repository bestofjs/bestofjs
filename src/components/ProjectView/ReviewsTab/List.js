import React, { PropTypes } from 'react'
import Link from 'react-router/lib/Link'
import ProjectReview from './ProjectReview'

const List = React.createClass({
  propTypes: {
    project: PropTypes.object
  },
  renderLoggedinUserButton (isAlreadyReviewed) {
    const project = this.props.project
    if (isAlreadyReviewed) return (
      <div>Thank you for having reviewed "{project.name}" project!</div>
    )
    return this.renderAddButton(project)
  },
  renderAddButton () {
    const project = this.props.project
    return (
      <Link to={`/projects/${project.slug}/reviews/add`} className="btn">
        <span className={`octicon octicon-plus`} />
        {' '}
        REVIEW {project.name}
      </Link>
    )
  },
  renderLoginButton (onLogin, pending) {
    if (pending) return 'Loading...'
    return (
      <button className="btn" onClick={onLogin}>
        <span className={`octicon octicon-mark-github`} />
        {' '}
        Sign in with Github to add a review
      </button>
    )
  },
  render () {
    const { project, auth, authActions } = this.props
    const isLoggedin = auth.username !== ''
    const reviews = project.reviews || []
    const isAlreadyReviewed = isLoggedin && reviews.some(item => item.createdBy === auth.username)
    return (
      <div>

        {reviews.length === 0 && (
          <p>
            Find here what users really think reading about {project.name} project.
          </p>
        )}

        {reviews.length > 0 ? (
          <div className="project-link-container">
            <p>Average rating: {project.averageRating.toFixed(1)} / 5</p>
            {reviews.map(review =>
              <ProjectReview
                key={review._id}
                review={review}
                editable={auth.username === review.createdBy}
              />
            )}
          </div>
        ) : (
          <p>Be the first to review the project!</p>
        )}

        <div style={{ textAlign: 'center', padding: '2em 0 1em' }}>
          {isLoggedin ? (
            this.renderLoggedinUserButton(isAlreadyReviewed)
          ) : (
            this.renderLoginButton(authActions.login, auth.pending)
          )}
        </div>
      </div>
    )
  }
})
export default List
