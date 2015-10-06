var React = require('react');
var Router = require('react-router');
var {Link} = Router;

var MainContent = require('../common/MainContent');
var ProjectList = require('../projects/ProjectList');
var ErrorMessage = require('../common/utils/ErrorMessage');
var StarMeButton = require('../common/StarMeButton');

require('../../stylesheets/grid.styl');
require('../../stylesheets/button.styl');

var Home = React.createClass({

  render: function() {
    var { repo } = this.props.staticContent;
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
          <Link to="tags" params={{ id: '5568e47e355ea6282ecae9b9' }}>frameworks</Link>,
          {' '}
          <Link to="tags" params={{ id: '5568e488355ea6282ecae9e4' }}>react tools</Link>,
          {' '}
          <Link to="tags" params={{ id: '5568e47a355ea6282ecae9ab' }}>node.js CMS</Link>
          {' and many more... the best of JavaScript!'}
        </p>

        { this.props.allProjects && (
          <div className="row">
            <div className="col-sm-6">
              <div className="box">
                <h3 className="with-comment">Most popular projects</h3>
                <p className="explanation">By total number of stars on Github</p>
                <ProjectList
                  projects = {this.props.popularProjects.slice(0,20)}
                  maxStars = {this.props.maxStars}
                  showStars = { true }
                  showDelta = { false }
                />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="box">
                <h3 className="with-comment">Hot projects since yesterday</h3>
                <p className="explanation">By number of stars added yesterday on Github</p>
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
      </MainContent>
    );
  }

});

module.exports = Home;
