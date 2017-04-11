import React, { PropTypes } from 'react'
import ReviewReduxForm from './ReviewReduxForm'

import { createReview } from '../../../actions/reviewActions'

function submitCreate (project, auth) {
  return function (values, dispatch) {
    return dispatch(createReview(project, values, auth))
  }
}

const Create = React.createClass({
  propTypes: {
    project: PropTypes.object
  },
  render () {
    const { project, auth } = this.props
    return (
      <div>
        <h3>Add your review of "{project.name}" project</h3>
        <ReviewReduxForm
          project={project}
          auth={auth}
          onSave={submitCreate}
        />
      </div>
    )
  }
})
export default Create
