import React from 'react'
import { Link } from 'react-router'

import log from '../../helpers/log'
import MainContent from '../common/MainContent'
// import ProjectList from '../projects/ProjectTable'
import ErrorMessage from '../common/utils/ErrorMessage'
// import HotFilterPicker from './HotFilterPicker'

import HomeProjects from './HomeLayoutB'

const Home = React.createClass({
  render() {
    log('Render the <Home> component', this.props)
    const {
      hotProjects,
      isLoggedin,
      pending,
      authActions
    } = this.props
    return (
      <MainContent>
        { this.props.errorMessage && <ErrorMessage text={ this.props.errorMessage } /> }
        <h2 style={{ margin: '0 0 .2em' }}>
          Find the <i className="special">best</i> components to build amazing web applications!
        </h2>
        <p style={{ marginBottom: '1em' }}>
          Check out the most popular open-source projects and the latest trends about the web platform and node.js.
        </p>

        { hotProjects.length && (
          <HomeProjects {...this.props} />
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
