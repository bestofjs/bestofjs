import React from 'react'
import PropTypes from 'prop-types'
import ReviewReduxForm from './ReviewReduxForm'
import { withRouter } from 'react-router-dom'

import ProjectHeader from '../ProjectHeader'
import Tabs from '../Tabs'
import { updateReview } from '../../../actions/reviewActions'

const submitEdit = (review, history) => (project, auth) => {
  const reviewId = review._id
  const projectId = project.slug
  return function(values, dispatch) {
    const payload = Object.assign({}, values, {
      _id: reviewId,
      project: projectId
    })
    return dispatch(updateReview(project, payload, auth, history))
  }
}

const EditReview = ({ project, review, auth, history }) => {
  if (!review) return <div>Loading the review...</div>
  const onSave = submitEdit(review, history)
  return (
    <div>
      <ProjectHeader project={project} />
      <Tabs project={project} activePath="reviews" />
      <div className="project-tabs-content" style={{ marginBottom: '2em' }}>
        <div className="inner">
          <h3>
            Edit &quot{project.name}&quot review ({review.rating}/5)
          </h3>
          <ReviewReduxForm
            project={project}
            auth={auth}
            initialValues={review}
            onSave={onSave}
          />
        </div>
      </div>
    </div>
  )
}

EditReview.propTypes = {
  project: PropTypes.object
}

export default withRouter(EditReview)
