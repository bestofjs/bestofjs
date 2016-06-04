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
      <div className="project-tabs-content">
        <div className="inner">
          <h3>Add a link related to "{project.name}" project</h3>
          <LinkReduxForm
            project={ project }
            auth={ auth }
            initialValues={{ projects: [project.slug] }}
            onSave={ submitCreate }
          />
        </div>
      </div>
    );
  }
});
export default CreateLink;
