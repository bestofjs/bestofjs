import React from 'react';

import MainContent from '../common/MainContent';
import log from '../../helpers/log';
// import TagLabel from '../tags/TagLabel';

const Project = React.createClass({

  render() {
    log('Render <Project>', this.props);
    const { project, review, link, auth, authActions, children } = this.props;
    return (
      <MainContent className="project-page">
          { project.id && (
            <div>

              <h1 style={{ margin: '0 0 0.5rem' }}>{ project.name }</h1>

              { children && project && React.cloneElement(children, {
                project,
                review,
                link,
                auth,
                authActions
              }) }


            </div>
          ) }
      </MainContent>
    );
  }

});

module.exports = Project;
