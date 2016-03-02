// Header used by project related items: reviews and links
import React from 'react';
import { Link } from 'react-router';

import fromNow from '../../helpers/fromNow';
const ItemHeader = React.createClass({
  renderEditButton(url) {
    return (
      <Link
        to={ url }
        style={{ marginLeft: 5 }}
      >
        <span className={`octicon octicon-pencil`}></span>
        {' '}
        EDIT
      </Link>
    );
  },
  render() {
    const { item, editable, editLinkTo } = this.props;
    const displayDate = item.updatedAt ? item.updatedAt : item.createdAt;
    return (
      <div className="project-review-date">
        <span className={`octicon octicon-person`}></span>
        {' '}
        { item.createdBy }
        <span className={`octicon octicon-calendar`} style={{ marginLeft: 10 }}></span>
        {' '}
        { item.updatedAt && 'Updated '}
        { fromNow(displayDate) }
        { editable && this.renderEditButton(editLinkTo) }
      </div>
    );
  }
});
export default ItemHeader;
