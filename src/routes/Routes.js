import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import asyncComponent from './asyncComponent'

import getHomePage from '../containers/HomePage'
import ProjectsPage from '../containers/AllProjectsPage'
import HoFPage from '../containers/HoFPage'
import TagFilter from '../containers/TagFilterPage'
import TextFilter from '../containers/TextFilterPage'
import items from './sortItems'
import NoMatch from './NoMatch'

const HomePage = getHomePage(10)
const AsyncAboutPage = asyncComponent(() =>
  import(/* webpackChunkName: "about" */ '../containers/AboutPage')
)
const AsyncMyProjects = asyncComponent(() =>
  import(/* webpackChunkName: "my-projects" */ '../containers/MyProjectsPage')
)
const AsyncViewProject = asyncComponent(() =>
  import(/* webpackChunkName: "single-project" */ './Projects')
)
const AsyncRequests = asyncComponent(() =>
  import(/* webpackChunkName: "my-requests" */ './Requests')
)

const Routes = () => (
  <Switch>
    <Route exact path="/" component={HomePage} />
    {items.map(item => (
      <Route
        exact
        key={item.key}
        path={`/projects/${item.path}`}
        component={ProjectsPage(item.key)}
      />
    ))}
    <Route path="/projects">
      <AsyncViewProject />
    </Route>
    <Route exact path="/search/:text" component={TextFilter} />
    {items.map(item => (
      <Route
        exact
        key={item.key}
        path={`/tags/:id/${item.path}`}
        component={TagFilter(item.key)}
      />
    ))}
    <Route exact path="/hall-of-fame" component={HoFPage} />
    <Redirect from="/hof" to="/hall-of-fame" />
    <Route path="/myprojects">
      <AsyncMyProjects />
    </Route>
    <Route path="/requests">
      <AsyncRequests />
    </Route>
    <Route exact path="/about" component={AsyncAboutPage} />
    <Route component={NoMatch} />
  </Switch>
)

export default Routes
