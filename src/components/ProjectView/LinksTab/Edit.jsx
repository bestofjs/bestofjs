import React, { PropTypes } from 'react';

import LinkReduxForm from './LinkReduxForm';
import { updateLink } from '../../../actions/linkActions';

const EditLink = React.createClass({
  propTypes: {
    project: PropTypes.object,
  },
  submitEdit(project, username) {
    const reviewId = this.props.link.id;
    return function (values, dispatch) {
      const payload = Object.assign({}, values, {
        id: reviewId
      });
      return dispatch(updateLink(payload, username));
    };
  },
  render() {
    const { project, auth, link } = this.props;
    return (
      <div>
        <h3>Edit a link</h3>
        <LinkReduxForm
          project={ project }
          auth={ auth }
          initialValues={ link }
          onSave={this.submitEdit}
        />
      </div>
    );
  }
});
export default EditLink;
