import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import asyncComponent from './asyncComponent'

import HomePage from '../pages/home-page'
import BookmarksPage from '../pages/bookmarks-page'
import HallOfFamePage from '../pages/HallOfFamePage'
import TagsPage from '../pages/tags-page'
import NoMatch from './NoMatch'
import { SearchResultsContainer } from '../components/search/SearchResults'

const AsyncAboutPage = asyncComponent(() =>
  import(/* webpackChunkName: "about" */ '../pages/AboutPage')
)
const AsyncViewProject = asyncComponent(() =>
  import(/* webpackChunkName: "single-project" */ '../pages/ProjectDetails/ProjectDetails')
)

const Routes = props => {
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/projects/:id">
        <AsyncViewProject {...props} />
      </Route>
      <Route exact path="/projects" component={SearchResultsContainer} />
      <Redirect from={`/tags/:id`} to={`/projects?tags=:id`} />
      <Route from={`/tags`} component={TagsPage} />
      <Route exact path="/hall-of-fame">
        <HallOfFamePage {...props} />
      </Route>
      <Redirect from="/hof" to="/hall-of-fame" />
      <Redirect from="/myprojects" to="/bookmarks" />
      <Route path="/bookmarks" component={BookmarksPage} />
      <Route exact path="/about" component={AsyncAboutPage} />
      <Route component={NoMatch} />
    </Switch>
  )
}

export default Routes
