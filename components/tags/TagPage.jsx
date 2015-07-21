var React = require('react');
var Router = require('react-router');
var {Link} = Router;
var MainContent = require('../common/MainContent');
var ProjectList = require('../projects/ProjectList');
var flux = require('../../scripts/app');

var TagPage = React.createClass({
  mixins: [Router.State],
  componentDidMount: function() {
    console.log('TagPage did mount');
    var id = this.getParams().id;
    flux.actions.getTag(id);
  },
  render: function() {
    var tag = this.props.tag;
    return (
      <MainContent>
        <h1>
          <span className="fa fa-tag" style={{ marginRight: 10 }}></span>
          { tag.name }</h1>
        <p>{ tag.description }</p>
        { tag.projects && (
          <div>
            <p style={{ paddingTop: 0 }}>{ tag.projects.length } projects with the tag &quot;{ tag.name }&quot;.</p>
            <ProjectList
              projects={ tag.projects }
              maxStars={ tag.projects[0].stars }
              showTags={ false }
              showDescription={ true }
            />
          </div>
        )}
      </MainContent>
    );
  }

});


TagPage.project = React.createClass({

  render: function() {
    var project = this.props.project;
    return (
      <Link
        to="projects"
        params={{ id: project._id }}
        className="collection-item"
      >
        { project.name }
        <span className="badge">{ project.stars }</span>
      </Link>
    );
  }

});

module.exports = TagPage;
