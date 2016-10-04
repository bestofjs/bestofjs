import React, { PropTypes } from 'react'

import LinkReduxForm from './LinkReduxForm'
import { updateLink } from '../../../actions/linkActions'

const EditLink = React.createClass({
  propTypes: {
    project: PropTypes.object
  },
  submitEdit (project, auth) {
    const linkId = this.props.link._id
    return function (values, dispatch) {
      const payload = Object.assign({}, values, {
        _id: linkId
      })
      return dispatch(updateLink(project, payload, auth))
    }
  },
  render () {
    const { project, auth, link } = this.props
    if (!link) return (
      <div>Loading the link...</div> // displayed if the page is loaded from a direct URL
    )
    return (
      <div className="project-tabs-content">
        <div className="inner">
          <h3>Edit a link</h3>
          {link && <LinkReduxForm
            project={project}
            auth={auth}
            initialValues={link}
            onSave={this.submitEdit}
          />}
        </div>
      </div>
    )
  }
})
export default EditLink
