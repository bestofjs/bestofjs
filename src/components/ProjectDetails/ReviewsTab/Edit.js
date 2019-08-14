import React from 'react'
import PropTypes from 'prop-types'
import ReviewReduxForm from './ReviewReduxForm'
import { withRouter } from 'react-router-dom'

// import { updateReview } from '../../../actions/reviewActions'
import Spinner from '../../common/Spinner'

// const submitEdit = (review, history, dispatch) => (project, auth) => {
//   const reviewId = review._id
//   const projectId = project.slug
//   return function(values) {
//     const payload = Object.assign({}, values, {
//       _id: reviewId,
//       project: projectId
//     })
//     return dispatch(updateReview(project, payload, auth, history))
//   }
// }

const EditReview = ({
  project,
  reviews,
  auth,
  history,
  match,
  updateReview
}) => {
  const {
    params: { reviewId }
  } = match
  const review = reviews.find(doc => doc._id === reviewId)
  if (!review) return <Spinner />
  const onSave = (project, auth) => values =>
    updateReview({
      ...values,
      _id: reviewId,
      project: project.full_name
    })
  return (
    <div className="inner">
      <h3>
        Edit &quot;{project.name}&quot; review ({review.rating}/5)
      </h3>
      <ReviewReduxForm
        project={project}
        auth={auth}
        initialValues={review}
        isInitialValid={true}
        onSave={onSave}
      />
    </div>
  )
}

EditReview.propTypes = {
  project: PropTypes.object
}

export default withRouter(EditReview)
