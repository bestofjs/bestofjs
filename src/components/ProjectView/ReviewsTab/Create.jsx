import React, { PropTypes } from 'react';
import ReviewReduxForm from './ReviewReduxForm';

import { addReview } from '../../../actions/linkActions';

function submitCreate(project, username) {
  return function (values, dispatch) {
    return dispatch(addReview(project, values, username));
  };
}

const Create = React.createClass({
  propTypes: {
    project: PropTypes.object
  },
  render() {
    const { project, auth } = this.props;
    return (
      <div>
        <h3>Add your review of "{project.name}" project</h3>
        <ReviewReduxForm
          project={ project }
          auth={ auth }
          onSave={ submitCreate }
        />
      </div>
    );
  }
});
export default Create;
