var React = require('react');
var MainContent = require('../common/MainContent');
var ProjectGrid = require('../projects/ProjectGrid');
var ProjectList = require('../projects/ProjectList');

var AllProjectsPage = React.createClass({

  render: function() {
    return (
      <MainContent>
        <h1>All projects</h1>
        <ProjectList
          projects = {this.props.projects}
        />
    </MainContent>
    );
  }

});

module.exports = AllProjectsPage;
