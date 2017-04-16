import React from 'react'
import { connect } from 'react-redux'

import Form from '../components/user-requests/add-project/AddProjectReduxForm'
import { addProject } from '../actions/repoActions'

const SubmitRepoPage = ({ projects, auth }) => {
  const onSave = (values, dispatch) => {
    return dispatch(addProject(values, auth))
  }
  return (
    <Form
      onSave={onSave}
      projects={projects}
    />
  )
}

function mapStateToProps (state) {
  const {
    entities: { projects },
    auth
  } = state
  return {
    projects,
    auth
  }
}

export default connect(mapStateToProps)(SubmitRepoPage)
