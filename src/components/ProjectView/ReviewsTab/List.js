import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import ProjectHeader from '../ProjectHeader'
import Tabs from '../Tabs'
import ProjectReview from './ProjectReview'

const List = ({ project, auth, authActions }) => {
  const isLoggedin = auth.username !== ''
  const reviews = project.reviews || []
  const isAlreadyReviewed =
    isLoggedin && reviews.some(item => item.createdBy === auth.username)
  const renderLoggedinUserButton = isAlreadyReviewed => {
    if (isAlreadyReviewed)
      return (
        <div>
          Thank you for having reviewed &quot;{project.name}&quot; project!
        </div>
      )
    return renderAddButton(project)
  }
  const renderAddButton = () => {
    return (
      <Link to={`/projects/${project.slug}/reviews/add`} className="btn">
        <span className="octicon octicon-plus" /> REVIEW {project.name}
      </Link>
    )
  }
  const renderLoginButton = (onLogin, pending) => {
    if (pending) return 'Loading...'
    return (
      <button className="btn" onClick={onLogin}>
        <span className="octicon octicon-mark-github" /> Sign in with GitHub to
        add a review
      </button>
    )
  }
  return (
    <div>
      <ProjectHeader project={project} />
      <Tabs project={project} activePath="reviews" />
      <div className="project-tabs-content" style={{ marginBottom: '2em' }}>
        <div className="inner">
          {reviews.length === 0 &&
            <p>
              Find here what users really think reading about {project.name}{' '}
              project.
            </p>}

          {reviews.length > 0
            ? <div className="project-link-container">
                <p>
                  Average rating: {project.averageRating.toFixed(1)} / 5
                </p>
                {reviews.map(review =>
                  <ProjectReview
                    key={review._id}
                    review={review}
                    editable={auth.username === review.createdBy}
                  />
                )}
              </div>
            : <p>Be the first to review the project!</p>}

          <div style={{ textAlign: 'center', padding: '2em 0 1em' }}>
            {isLoggedin
              ? renderLoggedinUserButton(isAlreadyReviewed)
              : renderLoginButton(authActions.login, auth.pending)}
          </div>
        </div>
      </div>
    </div>
  )
}

List.propTypes = {
  project: PropTypes.object
}

export default List
