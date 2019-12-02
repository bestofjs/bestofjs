import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import { Route, Switch } from 'react-router-dom'

import track from '../../helpers/track'
import * as actionCreators from '../../actions'
import { findProject } from '../../selectors/project'
import { useFetchProjectDetails } from '../../api/hooks'

import Spinner from '../../components/common/Spinner'
import ProjectDetailsMainTab from '../../components/project-details/MainTab'
import ProjectHeader from '../../components/project-details/ProjectHeader'
import MainContent from '../../components/common/MainContent'

const ProjectDetailsPageContainer = props => {
  const { project } = props
  // if the user loads directly the `/projects/:id` URL in the browser,
  // the project is not available yet in the Redux store
  return project ? <ProjectDetailsPage {...props} /> : <Spinner />
}

const ProjectDetailsPage = props => {
  const { project } = props

  const { data: details, isLoading, error } = useFetchProjectDetails(project)
  const projectWithDetails = getProjectWithDetails(project, details)

  useEffect(() => {
    if (project) {
      track('View project', project.name)
    }
  })

  return (
    <MainContent>
      <ProjectHeader {...props} project={projectWithDetails} />
      <Switch>
        <Route
          exact
          path="/projects/:id"
          render={() => (
            <ProjectDetailsMainTab
              {...props}
              project={projectWithDetails}
              isLoading={isLoading}
              error={error}
            />
          )}
        />
      </Switch>
    </MainContent>
  )
}

function mapStateToProps(state, props) {
  const { auth } = state

  // `Route` components get a `match` prop. from react-router
  const params = props.match.params
  const { id } = params

  const project = findProject(id)(state)

  return {
    project,
    auth
  }
}

function mapDispatchToProps(dispatch, props) {
  const { dependencies } = props
  const { authApi } = dependencies
  return {
    actions: bindActionCreators(actionCreators, dispatch),
    authActions: {
      login: authApi.login
    },
    dispatch
  }
}

function getProjectWithDetails(project, details) {
  if (!details) return project
  const {
    npm,
    bundle,
    packageSize,
    description,
    github: { contributor_count, commit_count, created_at },
    timeSeries
  } = details

  return {
    ...project,
    description,
    timeSeries,
    commit_count,
    contributor_count,
    created_at,
    npm,
    bundle,
    packageSize
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ProjectDetailsPageContainer)
)
