import React from 'react'
import { Field } from 'redux-form'

import MainContent from '../../common/MainContent'
import GithubUserPicker from '../../common/form/GithubUserPicker'
import renderInput from '../../common/form/renderInput'
import renderFieldWidget from '../../common/form/renderFieldWidget'

const AddProjectForm = ({
  handleSubmit,
  submitting,
  onSave
}) => {
  const autocomplete = renderFieldWidget(GithubUserPicker)
  return (
    <MainContent className="small container double-padding">
      <form className="card ui form" onSubmit={handleSubmit(onSave)}>
        <div className="header">
          Suggest a new Hall of Fame member
        </div>
        <div className="inner">
          <Field
            label="Select a user on GitHub"
            name="hero"
            component={autocomplete}
          />
          <Field
            name="comment"
            label={'Comment'}
            component={renderInput}
            type="text"
          />
        </div>
        <div className="inner form-action-bar">
          <button
            className={`ui btn${submitting ? ' loading button' : ''}`}
            disabled={submitting}
            type="submit"
          >
            <span className="octicon octicon-repo-push" />
            {' '}
            SAVE REQUEST
          </button>
        </div>
      </form>
    </MainContent>
  )
}

export default AddProjectForm
