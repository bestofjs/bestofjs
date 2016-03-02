import React, { PropTypes } from 'react';

import LinkReduxForm from './LinkReduxForm';
import { createLink } from '../../../actions/linkActions';

function submitCreate(project, auth) {
  return function (values, dispatch) {
    return dispatch(createLink(project, values, auth));
  };
}

const CreateLink = React.createClass({
  propTypes: {
    project: PropTypes.object,
  },
  render() {
    const { project, auth } = this.props;
    return (
      <div>
        <h3>Add a link related to "{project.name}" project</h3>
        <LinkReduxForm
          project={ project }
          auth={ auth }
          initialValues={{ projects: [project.id] }}
          onSave={ submitCreate }
        />
      </div>
    );
  }
});
export default CreateLink;
