import React from 'react'
import PropTypes from 'prop-types'
import ReviewReduxForm from './ReviewReduxForm'
import { withRouter } from 'react-router-dom'

import ProjectHeader from '../ProjectHeader'
import Tabs from '../Tabs'
import { createReview } from '../../../actions/reviewActions'

const submitCreate = history => (project, auth) => {
  return function(values, dispatch) {
    return dispatch(createReview(project, values, auth, history))
  }
}

const Create = ({ project, auth, history }) => {
  const onSave = submitCreate(history)
  return (
    <div>
      <ProjectHeader project={project} />
      <Tabs project={project} activePath="reviews" />
      <div className="project-tabs-content" style={{ marginBottom: '2em' }}>
        <div className="inner">
          <h3>
            Add your review of &quot;{project.name}&quot; project
          </h3>
          <ReviewReduxForm project={project} auth={auth} onSave={onSave} />
        </div>
      </div>
    </div>
  )
}

Create.propTypes = {
  project: PropTypes.object
}

export default withRouter(Create)
