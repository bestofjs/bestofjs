var React = require('react');
var Router = require('react-router');
var {Link} = Router;
var { RaisedButton, FlatButton, FontIcon } = require('material-ui');

var flux = require('../../scripts/app');

var MainContent = require('../common/MainContent');
var ProjectGrid = require('../projects/ProjectGrid');
var ProjectList = require('../projects/ProjectList');
var TagList = require('../tags/TagList');
var SearchForm = require('./SearchForm');
var SearchResultList = require('./SearchResultList');

var Home = React.createClass({

  render: function() {
    return (
      <MainContent>
        <h2>Welcome to bestof.js.org!</h2>
        <p>Check out the most popular projects and the latest tendancies about JavaScript world:
          {' '}
          <Link to="tags" params={{ id: '5568e47e355ea6282ecae9b9' }}>MV* frameworks</Link>,
          {' '}
          <Link to="tags" params={{ id: '5568e488355ea6282ecae9e4' }}>React tools</Link>,
          ...
        </p>

        <SearchForm
          searchText = { this.props.searchText }
        />

        { this.props.searchText.length > 0 && (
          <SearchResultList
            projects = { this.props.filteredProjects }
            searchText = { this.props.searchText }
          />
        ) }

        { this.props.allProjects && (
          <div className="row">
            <div className="col-sm-4">
              <div className="box">
                <h3>All tags</h3>
                <TagList tags={ this.props.tags }></TagList>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="box">
                <h3>Most popular projects</h3>
                <ProjectList
                  projects = {this.props.popularProjects.slice(0,20)}
                  maxStars = {this.props.maxStars}
                  showStars = { true }
                  showDelta = { false }
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="box">
                <h3>Hot projects since yesterday</h3>
                <ProjectList
                  projects = {this.props.hotProjects.slice(0,20)}
                  maxStars = {this.props.maxStars}
                  showDelta={ true }
                  showStars={ false }
                />
              </div>
            </div>
          </div>
        )}

        <div style={{ padding: 20, textAlign: 'center'}}>
          <FlatButton
            containerElement={ <Link to="project-list" /> }
            linkButton={true}
            secondary={true}
            label="View All projects"
          />
        </div>

        { true && this.props.projects && (
          <div style={{ marginTop: 20 }}>
            <h2>All projects</h2>
            <ProjectGrid
              projects={ this.props.allProjects }
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
