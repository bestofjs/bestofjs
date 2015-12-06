var React = require('react');

var MainContent = require('../common/MainContent');
var ProjectList = require('../projects/ProjectList');
var TagLabel = require('../tags/TagTitle');

var TagFilter = React.createClass({

  render: function() {
    const { tag, projects } = this.props;

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
