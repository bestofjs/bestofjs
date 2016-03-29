import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import Field from '../../common/form/Field';
import SelectBox from '../../../containers/ProjectSelectBoxContainer';
import ErrorMessage from '../../common/utils/ErrorMessage';

import validate from './validate';

const LinkForm = React.createClass({
  propTypes: {
    project: PropTypes.object,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired
  },
  render() {
    const {
      project,
      auth,
      fields: {
        url,
        title,
        comment,
        projects
      },
      handleSubmit,
      valid,
      // errors,
      submitFailed,
      submitting,
      onSave // passed from parent component (<Create> / <Edit>)
    } = this.props;
    // console.log('Render LinkReduxForm', this.props);
    return (
      <form
        onSubmit={ handleSubmit(onSave(project, auth)) }
        className={ `ui form${valid ? '' : ' error'}` }
      >

        <Field
          label="URL"
          showError={ submitFailed && url.error }
          errorMessage={ url.error }
        >
          <input
            type="text"
            placeholder="http://blog.com/tutorial"
            {...url}
          />
        </Field>

        <Field
          label="Title"
          showError={ submitFailed && title.error }
          errorMessage={ title.error }
        >
          <input
            type="text"
            {...title}
          />
        </Field>

        <Field
          label="Comment"
          showError={ submitFailed && comment.error }
          errorMessage={ comment.error }
        >
          <textarea type="text" name="comment" {...comment} rows="10" />
        </Field>

        <Field
          label="Related projects"
          showError={ submitFailed && projects.error }
          errorMessage={ projects.error }
        >
          <SelectBox field={ projects } />
        </Field>

        { !valid && submitFailed &&
          <ErrorMessage>Fix invalid fields!</ErrorMessage>
        }

        <div className="form-action-bar">
          <button
            className={ `ui btn${submitting ? ' loading button' : ''}` }
            disabled={ submitting }
            type="submit"
          >
            <span className={`octicon octicon-repo-push`}></span>
            {' '}
            SAVE
          </button>
        </div>
      </form>
    );
  }
});
const LinkReduxForm = reduxForm({
  form: 'link',
  fields: ['url', 'title', 'comment', 'projects'],
  validate
})(LinkForm);

export default LinkReduxForm;
