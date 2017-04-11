import React, { PropTypes } from 'react'
import ReviewReduxForm from './ReviewReduxForm'

import { updateReview } from '../../../actions/reviewActions'

const Edit = React.createClass({
  propTypes: {
    project: PropTypes.object
  },
  submitEdit (project, auth) {
    const reviewId = this.props.review._id
    const projectId = this.props.project.slug
    return function (values, dispatch) {
      const payload = Object.assign({}, values, {
        _id: reviewId,
        project: projectId
      })
      return dispatch(updateReview(project, payload, auth))
    }
  },
  render () {
    const { project, review, auth } = this.props
    if (!review) return (
      <div>Loading the review...</div>
    )
    return (
      <div>
        <h3>Edit "{project.name}" review ({review.rating}/5)</h3>
        <ReviewReduxForm
          project={project}
          auth={auth}
          initialValues={review}
          onSave={this.submitEdit}
        />
      </div>
    )
  }
})
export default Edit
