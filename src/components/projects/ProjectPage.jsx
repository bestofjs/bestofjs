var React = require('react');
var MainContent = require('../common/MainContent');

var TagLabel = require('../tags/TagLabel');

function loadData(props) {
  const project = props.githubProjects.project;
  props.actions.fetchReadme(project);
}

var ProjectPage = React.createClass({

  componentWillMount() {
    loadData(this.props);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      loadData(nextProps);
    }
  },

  render: function() {
    if (process.env.NODE_ENV === 'development') console.log('Render project page', this.props);
    var project = this.props.githubProjects.project;
    return (
      <MainContent className="project-page">
          { project._id && (
            <div>
              { project.tags.map(function (tag) {
                return (
                  <TagLabel key={ tag.code } tag={ tag } />
                );
              }) }
              <h1 style={{ margin: '1rem 0' }}>{ project.name }</h1>
              <p>
                <i className="fa fa-quote-left icon"></i>{' '}
                { project.description }
                {' '}<i className="fa fa-quote-right icon"></i>
              </p>
              { project.url && (
                <p>
                  Website: <a href={ project.url }>{ project.url }</a>
                </p>
              )}
              <p>
                Github: <a href={ project.repository }>{ project.repository }</a>
                {' '}
                { project.stars } <i className="fa fa-star-o"></i>
              </p>

              <div className="readme" style={{ margin: '1em 0' }}>

                  <div>
                    <div className="header">
                      <i className="fa fa-book icon"></i>
                      {' '}
                      README
                    </div>

                    <div className="body">
                      { true && project.readme ? (
                        <div>
                          <div dangerouslySetInnerHTML={{ __html: project.readme }}></div>
                        </div>
                        ) : (
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ color: '#aaa' }}>Loading README from Github...</p>
                          <i className="fa fa-book" style={{ margin: '1em 0', fontSize: 80, color: '#bbb' }}></i>
                        </div>
                      )}
                    </div>

                    <div className="footer" style={{ textAlign: 'center' }}>
                      <a className="btn" href={ project.repository }>View on Github</a>
                    </div>
                  </div>

              </div>
            </div>
          ) }
      </MainContent>
    );
  }

});

module.exports = ProjectPage;
