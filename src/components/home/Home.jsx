var React = require('react');
var Router = require('react-router');
var {Link} = Router;

var MainContent = require('../common/MainContent');
var ProjectList = require('../projects/ProjectList');
var ErrorMessage = require('../common/utils/ErrorMessage');
var StarMeButton = require('../common/StarMeButton');

var Home = React.createClass({
  render: function() {
    const { repo } = this.props.staticContent || '?';
    const { hotProjects, popularProjects, maxStars }  = this.props;
    return (
      <MainContent>
        { this.props.errorMessage && <ErrorMessage text={ this.props.errorMessage } /> }
        <h2 style={{ marginTop: 0 }}>
          Find the <i className="special">best</i> components to build amazing web applications!
        </h2>
        <p style={{ marginBottom: '1em' }}>
          <StarMeButton url={ repo }/>
          Check out the most popular open-source projects and the latest trends:
          {' '}
          <Link to="/tags/framework">frameworks</Link>,
          {' '}
          <Link to="/tags/react">react tools</Link>,
          {' '}
          <Link to="/tags/cms-api">node.js CMS</Link>
          {' and many more... the best of JavaScript!'}
        </p>

        { hotProjects.length && (
          <div className="row">
            { /* Part 1: HOT projects */ }
            <div className="col-sm-6">
              <div className="box">
                <h3 className="with-comment">Hot projects since yesterday</h3>
                <p className="explanation">By number of stars added yesterday on Github</p>
                <ProjectList
                  projects = { hotProjects }
                  maxStars = { maxStars }
                  showDelta={ true }
                  showStars={ false }
                  showIndex={true}
                />
              </div>
            </div>

            { /* Part 2: Overall rankings */ }
            <div className="col-sm-6">
              <div className="box">
                <h3 className="with-comment">Most popular projects</h3>
                <p className="explanation">By total number of stars on Github</p>
                <ProjectList
                  projects = { popularProjects }
                  maxStars = { maxStars }
                  showStars = { true }
                  showDelta = { false }
                  showIndex={true}
                />
              </div>
            </div>
          </div>
        )}
      </MainContent>
    );
  }

});

module.exports = Home;
