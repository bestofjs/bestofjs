var React = require('react');
var Router = require('react-router');
var {Link} = Router;
var MainContent = require('../common/MainContent');
var flux = require('../../scripts/app');

var ProjectPage = React.createClass({
  mixins: [Router.State],
  componentDidMount: function() {
    console.log('ProjectPage did mount');
    var id = this.getParams().id;
    flux.actions.getProject(id);
  },

  render: function() {
    var project = this.props.project;
    return (
      <MainContent>
          { project._id && (
            <div>
              { project.tags.map(function (tag) {
                return (
                  <Link to={ 'tags' } params={{ id: tag._id }}
                    key={ tag._id }
                    className="project-tag deep-orange darken-1"
                    style={{ color: 'white', padding: '2px 10px', borderRadius: 4, backgroundColor: 'grey' }}
                  >
                    <span className="fa fa-tag" style={{ marginRight: 5 }}></span>
                    { tag.name }
                  </Link>
                );
              }) }
              <h1 style={{ marginTop: 5 }}>{ project.name }</h1>
              { project.url && (
                <p>
                  <a href={ project.url }>{ project.url }</a>
                </p>
              )}
              <p>{ project.stars } stars on <a href={ project.repository }>Github</a></p>
              <p>{ project.description }</p>

              <div className="readme" style={{ border: '1px solid #ccc', padding: 20 }}>

                {/*<h3>README</h3>*/}

                <div dangerouslySetInnerHTML={ project.readme }></div>

              </div>

            </div>
          ) }

      </MainContent>
    );
  }

});

module.exports = ProjectPage;
