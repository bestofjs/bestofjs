import React from 'react';


import MainContent from '../common/MainContent';
import Description from '../common/utils/Description';
import DeltaBar from '../common/utils/DeltaBar';
import fromNow from '../../helpers/fromNow';
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
              <h1 style={{ margin: '1rem 0' }}>{ project.name }</h1>
              <div className="project-card">
                <div className="inner">
                  <p>
                    <Description text={ project.description } />
                  </p>
                  { project.url && (
                    <p>
                      <span className="octicon octicon-globe"></span>
                      Website: <a href={ project.url }>{ project.url }</a>
                    </p>
                  )}
                </div>

                <div className="inner github" style={{ borderTop: '1px solid #ddd', paddingBottom: 0 }}>
                  <p>
                      <span className="octicon octicon-mark-github"></span>
                      Github: <a href={ project.repository }>{ project.repository }</a>
                    {' '}
                    { project.stars } <span className="octicon octicon-star"></span>
                  </p>
                  <div className="last-commit">
                    <span className="octicon octicon-git-commit"></span>
                    {' '}
                    Last update: { fromNow(project.pushed_at) }
                  </div>
                  <div>
                    { project.deltas.length > 0 && <DeltaBar data={ project.deltas.slice(0, 7) } />}
                  </div>
                </div>

              </div>


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
