import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import asyncComponent from './asyncComponent'

import HomePage from '../pages/HomePage'
import AllProjectsPage from '../pages/AllProjectsPage'
import HoFPage from '../pages/HallOfFamePage'
import TagFilter from '../pages/TagFilterPage'
import SearchResultsPage from '../pages/SearchResultsPage'
import items from './sortItems'
import NoMatch from './NoMatch'
import { SearchResultsContainer } from '../components/search/SearchResults'

const AsyncAboutPage = asyncComponent(() =>
  import(/* webpackChunkName: "about" */ '../pages/AboutPage')
)
const AsyncMyProjects = asyncComponent(() =>
  import(/* webpackChunkName: "my-projects" */ '../pages/MyProjectsPage')
)
const AsyncViewProject = asyncComponent(() =>
  import(/* webpackChunkName: "single-project" */ '../pages/ProjectDetails/ProjectDetails')
)
const AsyncRequests = asyncComponent(() =>
  import(/* webpackChunkName: "my-requests" */ './Requests')
)

const Routes = props => {
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      {false &&
        items.map(item => (
          <Route
            exact
            key={item.key}
            path={`/projects/${item.path}`}
            component={AllProjectsPage(item.key)}
          />
        ))}
      <Route
        path="/projects/trending/:period"
        component={SearchResultsContainer}
      />
      <Route exact path="/projects/:id">
        <AsyncViewProject {...props} />
      </Route>
      <Route exact path="/projects" component={SearchResultsContainer} />
      <Route exact path="/search/:text" component={SearchResultsPage} />
      {items.map(item => (
        <Route
          exact
          key={item.key}
          path={`/tags/:id/${item.path}`}
          component={TagFilter(item.key)}
        />
      ))}
      <Route
        exact
        path="/hall-of-fame"
        render={ownProps => <HoFPage {...props} {...ownProps} />}
      />
      <Redirect from="/hof" to="/hall-of-fame" />
      <Redirect from="/myprojects" to="/bookmarks" />
      <Route path="/bookmarks">
        <AsyncMyProjects />
      </Route>
      <Route path="/requests">
        <AsyncRequests />
      </Route>
      <Route exact path="/about" component={AsyncAboutPage} />
      <Route component={NoMatch} />
    </Switch>
  )
}

export default Routes
