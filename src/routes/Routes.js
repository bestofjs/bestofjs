import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import asyncComponent from './asyncComponent'

import HomePage from '../pages/home-page'
import BookmarksPage from '../pages/bookmarks-page'
import { FeaturedPage } from '../pages/featured-page'
import HallOfFamePage from '../pages/hall-of-fame-page'
import TagsPage from '../pages/tags-page'
import { SearchResultsPage } from '../pages/search-results-page'
import NoMatch from './NoMatch'

const AsyncAboutPage = asyncComponent(() =>
  import(/* webpackChunkName: "about" */ '../pages/about-page')
)
const AsyncViewProject = asyncComponent(() =>
  import(/* webpackChunkName: "single-project" */ '../pages/project-details-page')
)

const Routes = props => {
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/projects/:id">
        <AsyncViewProject {...props} />
      </Route>
      <Route exact path="/projects" component={SearchResultsPage} />
      <Redirect from={`/tags/:id`} to={`/projects?tags=:id`} />
      <Route from={`/tags`} component={TagsPage} />
      <Route exact path="/hall-of-fame">
        <HallOfFamePage {...props} />
      </Route>
      <Redirect from="/hof" to="/hall-of-fame" />
      <Route path="/bookmarks" component={BookmarksPage} />
      <Route path="/featured" component={FeaturedPage} />
      <Route exact path="/about" component={AsyncAboutPage} />
      <Route component={NoMatch} />
    </Switch>
  )
}

export default Routes
