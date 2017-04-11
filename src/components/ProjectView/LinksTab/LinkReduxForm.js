import React, { PropTypes } from 'react'
import { reduxForm, Field } from 'redux-form'

import SelectBox from '../../../containers/ProjectSelectBoxContainer'
import ErrorMessage from '../../common/utils/ErrorMessage'
import renderInput from '../../common/form/renderInput'
import renderFieldWidget from '../../common/form/renderFieldWidget'

import validate from './validate'

const LinkForm = React.createClass({
  propTypes: {
    project: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired
  },
  render () {
    const {
      project,
      auth,
      handleSubmit,
      valid,
      // errors,
      submitFailed,
      submitting,
      onSave // passed from parent component (<Create> / <Edit>)
    } = this.props
    const renderSelectProject = renderFieldWidget(SelectBox)
    return (
      <form
        onSubmit={handleSubmit(onSave(project, auth))}
        className={`ui form${valid ? '' : ' error'}`}
      >

        <Field
          label="URL"
          name="url"
          component={renderInput}
          type="text"
        />

        <Field
          label="Title"
          name="title"
          component={renderInput}
          type="text"
          maxLength={100}
        />

        <Field
          label="Related projects"
          name="projects"
          component={renderSelectProject}
        />

        {!valid && submitFailed &&
          <ErrorMessage>Fix invalid fields!</ErrorMessage>
        }

        <div className="form-action-bar">
          <button
            className={`ui btn${submitting ? ' loading button' : ''}`}
            disabled={submitting}
            type="submit"
          >
            <span className="octicon octicon-repo-push" />
            {' '}
            SAVE
          </button>
        </div>
      </form>
    )
  }
})

const LinkReduxForm = reduxForm({
  form: 'link',
  fields: ['url', 'title', 'comment', 'projects'],
  validate
})(LinkForm)

export default LinkReduxForm
