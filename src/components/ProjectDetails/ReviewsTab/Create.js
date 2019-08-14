import React from 'react'
import PropTypes from 'prop-types'
import ReviewReduxForm from './ReviewReduxForm'
import { withRouter } from 'react-router-dom'

import ProjectHeader from '../ProjectHeader'
import Tabs from '../Tabs'
import { createReview } from '../../../actions/reviewActions'
import ProjectTabsContent from '../ProjectTabsContent'

const submitCreate = (history, dispatch) => (project, auth) => {
  return function(values) {
    return dispatch(createReview(project, values, auth, history))
  }
}

const Create = ({ project, auth, history, dispatch }) => {
  const onSave = submitCreate(history, dispatch)
  return (
    <div>
      <ProjectHeader project={project} />
      <Tabs project={project} activePath="reviews" />
      <ProjectTabsContent style={{ marginBottom: '2em' }}>
        <div className="inner">
          <h3>Add your review of &quot;{project.name}&quot; project</h3>
          <ReviewReduxForm
            project={project}
            auth={auth}
            onSave={onSave}
            initialValues={{ comment: '' }}
          />
        </div>
      </ProjectTabsContent>
    </div>
  )
}

Create.propTypes = {
  project: PropTypes.object
}

export default withRouter(Create)
