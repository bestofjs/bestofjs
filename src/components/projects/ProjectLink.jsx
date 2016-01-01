import React, { PropTypes } from 'react';
import fromNow from '../../helpers/fromNow';

const ProjectLink = React.createClass({
  propTypes: {
    link: PropTypes.object.isRequired
  },
  render() {
    const { link } = this.props;
    return (
      <div className="project-link">
        <div className="project-link-date">
          Added by { link.createdBy }
          {' '}
          { fromNow(link.createdAt) }
        </div>
        <a href={ link.url } target="_blank">
          <span className={`octicon octicon-link-external`}></span>
          {' '}
          { link.title }
        </a>
      </div>
    );
  }
});
export default ProjectLink;
