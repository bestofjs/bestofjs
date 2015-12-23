import React from 'react';

import MainContent from '../common/MainContent';
import ProjectList from '../projects/ProjectList';
import TagLabel from '../tags/TagTitle';

const TagFilter = React.createClass({

  render() {
    const { tag, projects } = this.props;

    return (
      <MainContent className="small">
        { tag.name && (
          <div style={{ fontSize: 18, marginBottom: 20 }}>

            <TagLabel tag={ tag } />

            <span style={{ marginLeft: 10 }}>
              { projects.length === 1 ? (
                'Only one project for now'
              ) : (
                projects.length + ' projects'
              ) }
            </span>
          </div>
        ) }

        { projects.length > 0 && (
           <ProjectList
             projects = { projects }
             maxStars = { projects[0].stars}
             showDescription
             showURL
           />
       ) }

      </MainContent>
    );
  }
});

module.exports = TagFilter;
