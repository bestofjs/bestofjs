import React from 'react'

import MainContent from '../../common/MainContent'
import GithubRepoPicker from '../../common/form/GithubRepoPicker'
import Field from '../../common/form/Field'

const AddProjectForm = React.createClass({
  render() {
    const {
      fields: {
        comment,
        project
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
            Suggest a Github project
          </div>
          <div className="inner">
            <Field
              label="Select a project on Github"
              showError={submitFailed && project.error}
              errorMessage={project.error}
            >
              <GithubRepoPicker field={project} />
            </Field>
            <Field
              label="Your comment"
              showError={submitFailed && comment.error}
              errorMessage={ comment.error }
            >
              <input type="text" {...comment} />
            </Field>
          </div>
          <div className="inner form-action-bar">
            <button
              className={ `ui btn${submitting ? ' loading button' : ''}` }
              disabled={ submitting }
              type="submit"
            >
              <span className={`octicon octicon-repo-push`}></span>
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
