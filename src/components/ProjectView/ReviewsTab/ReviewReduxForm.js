import React from 'react'
import PropTypes from 'prop-types'
import { withFormik } from 'formik'
import classNames from 'classnames'

import FieldRow from '../../common/form/FieldRow'
import Markdown from '../../common/form/MarkdownField'
import RatingBox from './RatingBox'
import validate from './validate'

const ReviewForm = ({
  values,
  auth,
  handleSubmit,
  handleChange,
  isValid,
  isSubmitting,
  setFieldValue,
  setFieldTouched
}) => {
  const canSubmit = isValid && !isSubmitting
  return (
    <form
      onSubmit={handleSubmit}
      className={classNames('ui form', { error: !isValid })}
    >
      <FieldRow label="Your rating:">
        <RatingBox
          field={{
            name: 'rating',
            value: values.rating,
            onChange: value => {
              setFieldValue('rating', value)
              setFieldTouched('rating', true)
            }
          }}
        />
      </FieldRow>

      <Markdown
        field={{
          name: 'comment',
          onChange: handleChange,
          value: values.comment
        }}
      />

      <div className="form-action-bar">
        {auth.username && (
          <button
            className={classNames('ui btn', {
              'loading button': isSubmitting,
              disabled: !canSubmit
            })}
            disabled={!canSubmit}
            type="submit"
          >
            <span className="octicon octicon-cloud-upload" /> SAVE
          </button>
        )}
      </div>
    </form>
  )
}

ReviewForm.propTypes = {
  project: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired
}

const ReviewReduxForm = withFormik({
  mapPropsToValues: props => ({ ...props.initialValues }),
  handleSubmit: (values, { props }) => {
    const { project, auth, onSave } = props
    return onSave(project, auth)(values)
  },
  isInitialValid: props => props.isInitialValid,
  validate
})(ReviewForm)

export default ReviewReduxForm
