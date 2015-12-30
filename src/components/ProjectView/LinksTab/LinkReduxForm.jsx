import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import Field from '../../common/form/Field';
import ErrorMessage from '../../common/utils/ErrorMessage';

import validate from './validate';

function submitLinkForm(values, dispatch) {
  console.info('Form ready to be submitted!', values, dispatch);
}

const LinkForm = React.createClass({
  propTypes: {
    project: PropTypes.object,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired
  },
  render() {
    const {
      // project,
      fields: {
        url,
        title,
        description
      },
      handleSubmit,
      valid,
      // errors,
      submitFailed
    } = this.props;
    console.log('Render LinkReduxForm', this.props);
    return (
      <form
        onSubmit={ handleSubmit(submitLinkForm) }
        className={ `ui form${valid ? '' : ' error'}` }
      >
        <Field label="URL" showError={ submitFailed && url.error }>
          <input type="text" name="url" {...url} placeholder="http://blog.com/tutorial" />
        </Field>
        <Field label="Title" showError={ submitFailed && title.error }>
          <input type="text" name="title" {...title} />
        </Field>
        <Field label="Description" showError={ submitFailed && description.error }>
          <textarea type="text" name="description" {...description} />
        </Field>
        { !valid && submitFailed &&
          <ErrorMessage>Fix invalid fields!</ErrorMessage>
        }
        <div className="form-action-bar">
          <button className="btn" type="submit">
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
  fields: ['url', 'title', 'description'],
  validate
})(LinkForm);

export default LinkReduxForm;
