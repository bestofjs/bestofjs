import React from 'react'
import PropTypes from 'prop-types'
import LinkReduxForm from './LinkReduxForm'
import { withRouter } from 'react-router-dom'

import ProjectHeader from '../ProjectHeader'
import Tabs from '../Tabs'
import { updateLink } from '../../../actions/linkActions'

const submitEdit = (linkId, history) => (project, auth) => {
  return function (values, dispatch) {
    const payload = Object.assign({}, values, {
      _id: linkId
    })
    return dispatch(updateLink(project, payload, auth, history))
  }
}

const EditLink = ({ project, auth, link, history }) => {
  if (!link) return (
    <div>Loading the link...</div> // displayed if the page is loaded from a direct URL
  )
  const linkId = link._id
  const onSave = submitEdit(linkId, history)
  return (
    <div>
      <ProjectHeader project={project} />
      <Tabs project={project} activePath="links" />
      <div className="project-tabs-content">
        <div className="inner">
          <h3>Edit a link</h3>
          {link && <LinkReduxForm
            project={project}
            auth={auth}
            initialValues={link}
            onSave={onSave}
          />}
        </div>
      </div>
    </div>
  )
}

EditLink.propTypes = {
  project: PropTypes.object
}

export default withRouter(EditLink)
