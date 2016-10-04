import React from 'react'

import MainContent from '../../common/MainContent'
import GithubUserPicker from '../../common/form/GithubUserPicker'
import Field from '../../common/form/Field'

const AddProjectForm = React.createClass({
  render () {
    const {
      fields: {
        comment,
        hero
      },
      handleSubmit,
      submitFailed,
      submitting,
      onSave
    } = this.props
    return (
      <MainContent className="small container double-padding">
        <form className="card ui form" onSubmit={handleSubmit(onSave)}>
          <div className="header">
            Suggest a new Hall of Fame member
          </div>
          <div className="inner">
            <Field
              label="Select a user on Github"
              showError={submitFailed && hero.error}
              errorMessage={hero.error}
            >
              <GithubUserPicker field={hero} />
            </Field>
            <Field
              label={'Comment'}
              showError={submitFailed && comment.error}
              errorMessage={comment.error}
            >
              <input type="text" {...comment} />
            </Field>
          </div>
          <div className="inner form-action-bar">
            <button
              className={`ui btn${submitting ? ' loading button' : ''}`}
              disabled={submitting}
              type="submit"
            >
              <span className={`octicon octicon-repo-push`} />
              {' '}
              SAVE REQUEST
            </button>
          </div>
        </form>
      </MainContent>
    )
  }
})

export default AddProjectForm
