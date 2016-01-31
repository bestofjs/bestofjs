import React, { PropTypes } from 'react';

import Header from '../ItemHeader';

const ProjectLink = React.createClass({
  propTypes: {
    link: PropTypes.object.isRequired
  },
  render() {
    const { link, project, editable } = this.props;
    return (
      <div className="project-link">
        <Header
          item={ link }
          editable={ editable }
          editLinkTo={ `/projects/${project.id}/links/${link._id}/edit` }
        />
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
