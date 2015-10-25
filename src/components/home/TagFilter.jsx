var React = require('react');
var PropTypes = React.PropTypes;
var MainContent = require('../common/MainContent');
var ProjectList = require('../projects/ProjectList');
var TagLabel = require('../tags/TagTitle');
import pluck from 'lodash/collection/pluck';

var TagFilter = React.createClass({

  render: function() {
    const tag = this.props.githubProjects.tagFilter;
    const allProjects = this.props.githubProjects.allProjects;
    const projects = allProjects.filter(function (project) {
      const ids = pluck(project.tags, 'code');
      return project.tags.length > 0 && ids.indexOf(tag.code) > -1;
    });

    return (
      <MainContent className="small">
        { tag.name && (
          <div style={{ fontSize: 18, marginBottom: 20 }}>

            <TagLabel tag={ tag } />

            <span style={{  marginLeft: 10 }}>
              { projects.length === 1 ? (
                'Only one project for now'
              ) : (
                projects.length +' projects'
              ) }
            </span>
          </div>
        ) }

        { projects.length > 0 && (
         <ProjectList
           projects = { projects }
           maxStars = { projects[0].stars}
           showDescription = { true }
           showURL = { true }
         />
       ) }

      </MainContent>
    );
  }

});

module.exports = TagFilter;
