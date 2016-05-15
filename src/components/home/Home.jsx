import React from 'react'

import log from '../../helpers/log'
import MainContent from '../common/MainContent'
import ProjectList from '../projects/ProjectList'
import ErrorMessage from '../common/utils/ErrorMessage'
import HotFilterPicker from './HotFilterPicker'

const Home = React.createClass({
  render() {
    log('Render the <Home> component', this.props)
    const { hotProjects, popularProjects, maxStars, isLoggedin, uiActions, hotFilter } = this.props
    return (
      <MainContent>
        { this.props.errorMessage && <ErrorMessage text={ this.props.errorMessage } /> }
        <h2 style={{ marginTop: 0 }}>
          Find the <i className="special">best</i> components to build amazing web applications!
        </h2>
        <p style={{ marginBottom: '1em' }}>
          Check out the most popular open-source projects and the latest trends about the web platform and node.js.
        </p>

        { hotProjects.length && (
          <div className="row">
            { /* Part 1: HOT projects */ }
            <div className="col-sm-6">
              <div className="box">
                <h3 className="with-comment">
                  <span className="mega-octicon octicon-flame icon"></span>
                  <span>Hot projects since </span>
                  <HotFilterPicker
                    currentValue={hotFilter}
                    onToggle={uiActions.toggleHotFilter}
                    items={[
                      {
                        value: 'daily',
                        text: 'yesterday'
                      },
                      {
                        value: 'weekly',
                        text: 'last week'
                      }
                    ]}
                  />
                </h3>
                <p className="explanation">
                  By number of stars added {hotFilter ? 'last week' : 'yesterday'} on Github
                </p>
                <ProjectList
                  projects = { hotProjects }
                  maxStars = { maxStars }
                  isLoggedin= { isLoggedin }
                  showDelta
                  deltaFilter={hotFilter}
                  showStars={false}
                  showIndex
                />
              </div>
            </div>

            { /* Part 2: Overall rankings */ }
            <div className="col-sm-6">
              <div className="box">
                <h3 className="with-comment">
                  <span className="mega-octicon octicon-star icon"></span>
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
    )
  }
})

module.exports = Home
