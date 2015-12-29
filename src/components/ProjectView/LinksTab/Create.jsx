import React, { PropTypes } from 'react';

import Field from '../../common/form/Field';

const CreateLink = React.createClass({
  propTypes: {
    project: PropTypes.object,
  },
  render() {
    const { project } = this.props;
    return (
      <form className="ui form">
        <h3>Add a link related to "{project.name}" project</h3>
        <Field label="URL">
          <input type="text" name="url" />
        </Field>
        <Field label="Title">
          <input type="text" name="title" />
        </Field>
        <Field label="Description">
          <textarea type="text" name="description" />
        </Field>
        <div>
          <button className="btn" type="submit">
            <span className={`octicon octicon-save`}></span>
            {' '}
            SAVE
          </button>
        </div>
      </form>
    );
  }
});
export default CreateLink;
