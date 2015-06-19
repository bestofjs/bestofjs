var React = require('react');
var MainContent = require('../common/MainContent');
var ProjectGrid = require('../projects/ProjectGrid');
var ProjectList = require('../projects/ProjectList');

var Home = React.createClass({

  render: function() {
    return (
      <MainContent>
        <h2>Welcome to bestof.js.org!</h2>
        <p>Check the most popular projects and the latest tendancies about JavaScript world: frameworks, librairies...</p>

        { this.props.projects && (
          <div className="pure-g">
            <div className="pure-u-1-2">
              <h3>Most popular</h3>
              <ProjectList
                projects = {this.props.popularProjects.slice(0,10)}
              />
            </div>
            <div className="pure-u-1-2">
              <h3>Hot projects</h3>
              <ProjectList
                projects = {this.props.hotProjects.slice(0,10)}
              />
            </div>
          </div>
        )}

        { true && this.props.projects && (
          <div>
            <h3>All projects</h3>
            <ProjectGrid
              projects={ this.props.projects }
              tags={ this.props.tags }
              selectedTag= {this.props.selectedTag}
              selectedSort= {this.props.selectedSort}
            />
          </div>
        ) }
      </MainContent>
    );
  }

});

module.exports = Home;
