var React = require('react');
var Router = require('react-router');
var {Link} = Router;
var MainContent = require('../common/MainContent');
//var { RaisedButton, FontIcon } = require('material-ui');
var actions = require('../../scripts/actions');
var TagLabel = require('../tags/TagLabel');

require('../../stylesheets/project.styl');

var ProjectPage = React.createClass({
  mixins: [Router.State],
  componentDidMount: function() {
    var id = this.getParams().id;
    actions.getProject(id);
  },

  render: function() {
    var project = this.props.project;
    return (
      <MainContent>
          { project._id && (
            <div>
              { project.tags.map(function (tag) {
                return (
                  <TagLabel key={ tag._id } tag={ tag } />
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

              { project.readme ? (
                <div className="readme" style={{ border: '1px solid #ccc', padding: 20, marginBottom: 20 }}>

                  {/*<h3>README</h3>*/}

                  <div dangerouslySetInnerHTML={ project.readme }></div>

                  <div style={{ textAlign: 'center' }}>
                    <a
                      linkButton={true}
                      href={ project.repository }
                      secondary={true}
                      label="View on GitHub"
                    >
                  </a>
                  </div>
                </div>
              ) : (
                <p>Loading README.md from Github...</p>
              )}

            </div>
          ) }

      </MainContent>
    );
  }

});

module.exports = ProjectPage;
