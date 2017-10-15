import React from 'react'
import PropTypes from 'prop-types'
import { Field, withFormik } from 'formik'
import classNames from 'classnames'

import SelectBox from '../../../containers/ProjectSelectBoxContainer'
import ErrorMessage from '../../common/utils/ErrorMessage'
import FieldRow from '../../common/form/FieldRow'
import Markdown from '../../common/form/MarkdownField'
import validate from './validate'

const LinkForm = ({
  handleSubmit,
  handleChange,
  setFieldValue,
  isValid,
  submitFailed,
  isSubmitting,
  touched,
  errors,
  values
}) => {
  const canSubmit = isValid && !isSubmitting
  return (
    <form
      onSubmit={handleSubmit}
      className={classNames('ui form', { error: !isValid })}
    >
      <FieldRow
        label={'URL'}
        showError={touched.url && errors.url}
        errorMessage={errors.url}
      >
        <Field name="url" type="text" />
      </FieldRow>

      <FieldRow
        label={'Title'}
        showError={touched.title && errors.title}
        errorMessage={errors.title}
      >
        <Field name="title" type="text" maxLength={100} />
      </FieldRow>

      <Markdown
        field={{
          name: 'comment',
          onChange: handleChange,
          value: values.comment
        }}
      />

      <FieldRow label="Related Projects">
        <SelectBox
          multi={true}
          field={{
            name: 'projects',
            value: values.projects,
            onChange: values => setFieldValue('projects', values)
          }}
        />
      </FieldRow>

      {!isValid &&
        submitFailed &&
        <ErrorMessage>Fix invalid fields!</ErrorMessage>}

      <div className="form-action-bar">
        <button
          className={classNames('ui btn', {
            'loading button': isSubmitting,
            disabled: !canSubmit
          })}
          disabled={!canSubmit}
          type="submit"
        >
          <span className="octicon octicon-repo-push" /> SAVE
        </button>
      </div>
    </form>
  )
}

LinkForm.propTypes = {
  project: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired
}

const LinkReduxForm = withFormik({
  mapPropsToValues: props => ({ ...props.initialValues }),
  handleSubmit: (values, { props }) => {
    const { project, auth, onSave } = props
    return onSave(project, auth)(values)
  },
  validate
})(LinkForm)

export default LinkReduxForm
