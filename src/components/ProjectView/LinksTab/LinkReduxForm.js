import React from 'react'
import PropTypes from 'prop-types'
import { withFormik } from 'formik'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import SelectBox from '../../../containers/ProjectSelectBoxContainer'
import ErrorMessage from '../../common/utils/ErrorMessage'
import FieldRow from '../../common/form/FieldRow'
import Button from '../../common/form/Button'
import Markdown from '../../common/form/MarkdownField'
import validate from './validate'
import Input from '../../common/form/Input'
import ActionBar from '../../common/form/ActionBar'

const LinkForm = ({
  handleSubmit,
  handleChange,
  handleBlur,
  setFieldValue,
  isValid,
  submitFailed,
  isSubmitting,
  // touched,
  errors,
  values,
  project
}) => {
  const canSubmit = isValid && !isSubmitting
  return (
    <form
      onSubmit={handleSubmit}
      className={classNames('ui form', { error: !isValid })}
    >
      <FieldRow label={'URL'} showError={errors.url} errorMessage={errors.url}>
        <Input
          name="url"
          type="text"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.url}
          isError={!!errors.url}
        />
      </FieldRow>

      <FieldRow
        label={'Title'}
        showError={errors.title}
        errorMessage={errors.title}
      >
        <Input
          name="title"
          type="text"
          maxLength={100}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.title}
          isError={!!errors.title}
        />
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
        submitFailed && <ErrorMessage>Fix invalid fields!</ErrorMessage>}

      <ActionBar>
        <Link
          style={{ marginRight: '2rem' }}
          to={`/projects/${project.slug}/links`}
        >
          CANCEL
        </Link>
        <Button
          loading={isSubmitting}
          className={classNames({
            disabled: !canSubmit
          })}
          disabled={!canSubmit}
          type="submit"
        >
          <span className="octicon octicon-repo-push" /> SAVE
        </Button>
      </ActionBar>
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
  isInitialValid: props => props.isInitialValid,
  validate
})(LinkForm)

export default LinkReduxForm
