import React from 'react';
import { Link } from 'react-router';

import log from '../../helpers/log';
import MainContent from '../common/MainContent';
import ProjectList from '../projects/ProjectList';
import ErrorMessage from '../common/utils/ErrorMessage';
import StarMeButton from '../common/StarMeButton';

const Home = React.createClass({
  render() {
    log('Render the <Home> component', this.props);
    const { repo } = this.props.staticContent || '?';
    const { hotProjects, popularProjects, maxStars, isLoggedin } = this.props;
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
                <h3 className="with-comment">
                  <span className="mega-octicon octicon-flame icon"></span>{' '}
                  Hot projects since yesterday
                </h3>
                <p className="explanation">By number of stars added yesterday on Github</p>
                <ProjectList
                  projects = { hotProjects }
                  maxStars = { maxStars }
                  isLoggedin= { isLoggedin }
                  showDelta
                  showStars={false}
                  showIndex
                />
              </div>
            </div>

            { /* Part 2: Overall rankings */ }
            <div className="col-sm-6">
              <div className="box">
                <h3 className="with-comment">
                  <span className="mega-octicon octicon-star icon"></span>{' '}
                  Most popular projects
                </h3>
                <p className="explanation">By total number of stars on Github</p>
                <ProjectList
                  projects = { popularProjects }
                  maxStars = { maxStars }
                  isLoggedin= { isLoggedin }
                  showStars
                  showDelta={false}
                  showIndex
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
