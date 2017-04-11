import React from 'react'
import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'

import createForm from '../components/user-requests/add-project/AddProjectReduxForm'
// import * as repoActionCreators from '../actions/repoActions'
import { addProject } from '../actions/repoActions'

const SubmitRepoPage = React.createClass({
  onSave (values, dispatch) {
    const { auth } = this.props
    return dispatch(addProject(values, auth))
  },
  render () {
    const { projects } = this.props
    const Form = createForm(projects)
    return (
      <Form
        onSave={this.onSave}
      />
    )
  }
})

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
