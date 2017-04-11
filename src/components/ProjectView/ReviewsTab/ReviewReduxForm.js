import React, { PropTypes } from 'react'
import { reduxForm, Field } from 'redux-form'

import ErrorMessage from '../../common/utils/ErrorMessage'
import renderFieldWidget from '../../common/form/renderFieldWidget'
import Markdown from '../../common/form/MarkdownField'
import RatingBox from './RatingBox'

import validate from './validate'

const ReviewForm = React.createClass({
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
    const ratingBoxField = renderFieldWidget(RatingBox)
    const mdField = renderFieldWidget(Markdown)
    return (
      <form
        onSubmit={handleSubmit(onSave(project, auth))}
        className={`ui form${valid ? '' : ' error'}`}
      >

        <Field
          label="Your rating:"
          name="rating"
          component={ratingBoxField}
        />
        {true && <Field
          name="comment"
          component={mdField}
        />}

        {!valid && submitFailed &&
          <ErrorMessage>Fix invalid fields!</ErrorMessage>
        }

        <div className="form-action-bar">
          {auth.username &&
            <button
              className={`ui btn${submitting ? ' loading button' : ''}`}
              disabled={submitting}
              type="submit"
            >
              <span className="octicon octicon-cloud-upload" />
              {' '}
              SAVE
            </button>
          }
        </div>
      </form>
    )
  }
})

const ReviewReduxForm = reduxForm({
  form: 'review',
  validate
})(ReviewForm)

export default ReviewReduxForm
