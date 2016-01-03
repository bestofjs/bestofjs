import React, { PropTypes } from 'react';
import ReviewReduxForm from './ReviewReduxForm';

import { updateReview } from '../../../actions/reviewActions';


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
      return dispatch(updateReview(payload, username));
    };
  },
  render() {
    const { project, review, auth } = this.props;
    if (!review) return (<div>Loading the review...</div>);
    return (
      <div>
        <h3>Edit "{project.name}" review {review.rating}</h3>
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
