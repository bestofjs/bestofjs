import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'

import SelectBox from '../../../containers/ProjectSelectBoxContainer'
import ErrorMessage from '../../common/utils/ErrorMessage'
import renderInput from '../../common/form/renderInput'
import renderFieldWidget from '../../common/form/renderFieldWidget'
import Markdown from '../../common/form/MarkdownField'
import validate from './validate'

const mdField = renderFieldWidget(Markdown)
const renderSelectProject = renderFieldWidget(SelectBox)

const LinkForm = ({
  project,
  auth,
  handleSubmit,
  valid,
  submitFailed,
  submitting,
  onSave // passed from parent component (<Create> / <Edit>)
}) => {
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
        name="comment"
        component={mdField}
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

LinkForm.propTypes = {
  project: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired
}

const LinkReduxForm = reduxForm({
  form: 'link',
  validate
})(LinkForm)

export default LinkReduxForm
