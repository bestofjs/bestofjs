import React, { PropTypes } from 'react';

import LinkReduxForm from './LinkReduxForm';

const CreateLink = React.createClass({
  propTypes: {
    project: PropTypes.object,
  },
  render() {
    const { project } = this.props;
    return (
      <div>
        <h3>Add a link related to "{project.name}" project</h3>
        <LinkReduxForm project={ project } />
      </div>
    );
  }
});
export default CreateLink;
