import React from 'react'
import { Route } from 'react-router-dom'

import MainContent from '../components/common/MainContent'
import createProjectPage from '../pages/ProjectPage/createProjectPage'

import GithubTab from '../components/ProjectView/GithubTab'

import LinksTabList from '../components/ProjectView/LinksTab/List'
import LinksTabAdd from '../components/ProjectView/LinksTab/Create'
import LinksTabEdit from '../components/ProjectView/LinksTab/Edit'

import ReviewsTabList from '../components/ProjectView/ReviewsTab/List'
import ReviewsTabAdd from '../components/ProjectView/ReviewsTab/Create'
import ReviewsTabEdit from '../components/ProjectView/ReviewsTab/Edit'

const GitHubTabComponent = createProjectPage(GithubTab)

const LinksListComponent = createProjectPage(LinksTabList)
const LinksAddComponent = createProjectPage(LinksTabAdd)
const LinksEditComponent = createProjectPage(LinksTabEdit)

const ReviewsListComponent = createProjectPage(ReviewsTabList)
const ReviewsAddComponent = createProjectPage(ReviewsTabAdd)
const ReviewsEditComponent = createProjectPage(ReviewsTabEdit)

const ProjectsRoutes = props => {
  const injectProps = Component => ownProps => (
    <Component {...ownProps} {...props} />
  )
  return (
    <MainContent className="container project-page">
      <Route
        exact
        path="/projects/:id"
        component={injectProps(GitHubTabComponent)}
      />
      <Route
        exact
        path="/projects/:id/links"
        component={injectProps(LinksListComponent)}
      />
      <Route
        exact
        path="/projects/:id/links/add"
        component={injectProps(LinksAddComponent)}
      />
      <Route
        exact
        path="/projects/:id/links/:linkId/edit"
        component={injectProps(LinksEditComponent)}
      />
      <Route
        exact
        path="/projects/:id/reviews"
        component={injectProps(ReviewsListComponent)}
      />
      <Route
        exact
        path="/projects/:id/reviews/:reviewId/edit"
        component={injectProps(ReviewsEditComponent)}
      />
      <Route
        exact
        path="/projects/:id/reviews/add"
        component={injectProps(ReviewsAddComponent)}
      />
    </MainContent>
  )
}

export default ProjectsRoutes
