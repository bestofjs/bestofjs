import React from 'react'
import { Link } from 'react-router'

import log from '../../helpers/log'
import MainContent from '../common/MainContent'
import ProjectList from '../projects/ProjectList'
import ErrorMessage from '../common/utils/ErrorMessage'
import HotFilterPicker from './HotFilterPicker'

// explanation added below the combobox used to to set the sort filter
const addedSince = (hotFilter) => {
  if (hotFilter === 'weekly') return 'last week'
  if (hotFilter === 'monthly') return 'last month'
  if (hotFilter === 'quaterly') return 'last quarter'
  return 'yesterday'
}

const Home = React.createClass({
  render() {
    log('Render the <Home> component', this.props)
    const {
      hotProjects,
      popularProjects,
      maxStars,
      isLoggedin,
      pending,
      uiActions,
      hotFilter,
      showMetrics,
      authActions
    } = this.props
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
                  <span>Hot projects </span>
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
                      },
                      {
                        value: 'monthly',
                        text: 'last month'
                      },
                      {
                        value: 'quaterly',
                        text: 'last 3 months'
                      }
                    ]}
                  />
                </h3>
                <p className="explanation">
                  By number of stars added {addedSince(hotFilter)} on Github
                </p>
                <ProjectList
                  projects = { hotProjects }
                  maxStars = { maxStars }
                  isLoggedin= { isLoggedin }
                  showDelta
                  deltaFilter={hotFilter}
                  showStars={false}
                  showIndex
                  showMetrics={showMetrics}
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
                  showMetrics={showMetrics}
                />
              </div>
            </div>
          </div>
        )}
        <MoreProjects
          handleClick={authActions.login}
          isLoggedin={isLoggedin}
          pending={pending}
        />
      </MainContent>
    )
  }
})

const MoreProjects1 = ({ handleClick, isLoggedin }) => (
  <div className="card">
    <div className="header">Do you want more projects ?</div>
    {isLoggedin ? (
      <Link className="inner link" to="/requests/add-project">
        Add a project on Github
      </Link>
    ) : (
      <div className="inner link" onClick={handleClick}>
        <span className="octicon octicon-mark-github" />
        {' '}
        Sign in with Github to add a new project.
      </div>
    )}
  </div>
)
const MoreProjects = ({ handleClick, isLoggedin, pending }) => {
  return (
    <div>
      <h3 className="with-comment">Do you want more projects ?</h3>
      {isLoggedin ? (
        <Link className="btn block button-outline" to="/requests/add-project">
          <span className="octicon octicon-plus" />
          {' '}
          Add a project on Github
        </Link>
      ) : (
        <button
          className={`btn block button-outline${pending ? ' ui loading button' : ''}`}
          onClick={handleClick}
        >
          <span className="octicon octicon-mark-github" />
          {' '}
          Sign in with Github to add a new project
        </button>
      )}
    </div>
  )
}

export default Home
