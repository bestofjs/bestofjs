var React = require('react');
//var PropTypes = React.PropTypes;
var MainContent = require('../common/MainContent');
var ProjectList = require('../projects/ProjectList');
var SearchText = require('../common/utils/SearchText');

var TextFilter = React.createClass({

  filterProject: function(project, text) {
    //if only one letter is entered, we search projects whose name start by the letter
    const pattern = text.length > 1 ? text : '^' + text;
    const re = new RegExp(pattern, 'i');
    if (re.test(project.name)) {
     return true;
    }
    if (text.length > 2) {
     if (re.test(project.description)) {
       return true;
     }
     if (re.test(project.repository)) {
       return true;
     }
     if (re.test(project.url)) {
       return true;
     }
    }
    return false;
  },

  render: function() {
    const searchText = this.props.githubProjects.textFilter;
    const allProjects = this.props.githubProjects.allProjects;
    const projects = allProjects
      .filter( project => this.filterProject(project, searchText))
      .slice(0, 50);//limit result list, just in case, to avoid slow down the app

    return (
      <MainContent className="small">

        { projects.length > 0 ? (
          <h3>
            Results for <SearchText>{ searchText }</SearchText>:{' '}
            {projects.length } projects found.
          </h3>
        ) : (
          <div>No project found for <SearchText>{ searchText }</SearchText></div>
        )}

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

module.exports = TextFilter;
