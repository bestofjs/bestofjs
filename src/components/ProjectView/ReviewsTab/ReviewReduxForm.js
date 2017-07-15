import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'

import ErrorMessage from '../../common/utils/ErrorMessage'
import renderFieldWidget from '../../common/form/renderFieldWidget'
import Markdown from '../../common/form/MarkdownField'
import RatingBox from './RatingBox'
import validate from './validate'

const ratingBoxField = renderFieldWidget(RatingBox)
const mdField = renderFieldWidget(Markdown)

const ReviewForm = ({
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
      <Field label="Your rating:" name="rating" component={ratingBoxField} />
      <Field name="comment" component={mdField} />

      {!valid &&
        submitFailed &&
        <ErrorMessage>Fix invalid fields!</ErrorMessage>}

      <div className="form-action-bar">
        {auth.username &&
          <button
            className={`ui btn${submitting ? ' loading button' : ''}`}
            disabled={submitting}
            type="submit"
          >
            <span className="octicon octicon-cloud-upload" /> SAVE
          </button>}
      </div>
    </form>
  )
}

ReviewForm.propTypes = {
  project: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired
}

const ReviewReduxForm = reduxForm({
  form: 'review',
  validate
})(ReviewForm)

export default ReviewReduxForm
