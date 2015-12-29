import React from 'react';

import MainContent from '../common/MainContent';
import log from '../../helpers/log';
import TagLabel from '../tags/TagLabel';

const Project = React.createClass({

  render() {
    log('Render <Project>', this.props);
    const { project, auth, authActions, children } = this.props;
    return (
      <MainContent className="project-page">
          { project.id && (
            <div>
              { project.tags.map(function (tag) {
                return (
                  <TagLabel key={ tag.id } tag={ tag } />
                );
              }) }
              <h1 style={{ margin: '0.5rem 0 1rem' }}>{ project.name }</h1>

              { children && project && React.cloneElement(children, {
                project,
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
