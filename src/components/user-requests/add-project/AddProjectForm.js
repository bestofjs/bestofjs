import React from 'react'
import { Field } from 'redux-form'

import MainContent from '../../common/MainContent'
import GithubRepoPicker from '../../common/form/GithubRepoPicker'
import renderInput from '../../common/form/renderInput'
import renderFieldWidget from '../../common/form/renderFieldWidget'

const AddProjectForm = ({ handleSubmit, submitting, onSave }) => {
  const autocomplete = renderFieldWidget(GithubRepoPicker)
  return (
    <MainContent className="small container double-padding">
      <form className="card ui form" onSubmit={handleSubmit(onSave)}>
        <div className="header">Suggest a GitHub project</div>
        <div className="inner">
          <Field
            name="project"
            label="Select a project on GitHub"
            component={autocomplete}
          />
          <Field
            name="comment"
            label="Your comment"
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
            <span className="octicon octicon-repo-push" /> SAVE REQUEST
          </button>
        </div>
      </form>
    </MainContent>
  )
}

export default AddProjectForm
