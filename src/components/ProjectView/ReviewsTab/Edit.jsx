import React, { PropTypes } from 'react';
import ReviewReduxForm from './ReviewReduxForm';

import { editReview } from '../../../actions/linkActions';


const Edit = React.createClass({
  propTypes: {
    project: PropTypes.object
  },
  submitEdit(project, username) {
    const reviewId = this.props.review.id;
    const projectId = this.props.project.id;
    return function (values, dispatch) {
      const payload = Object.assign({}, values, {
        id: reviewId,
        project: projectId
      });
      return dispatch(editReview(payload));
    };
  },
  render() {
    const { project, review, auth } = this.props;
    return (
      <div>
        <h3>Edit "{project.name}" review {review.score}</h3>
        <ReviewReduxForm
          project={project}
          auth={auth}
          initialValues={review}
          onSave={this.submitEdit}
        />
      </div>
    );
  }
});
export default Edit;
