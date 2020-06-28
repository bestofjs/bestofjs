import React, { Suspense, lazy } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import HomePage from 'pages/home-page'
import BookmarksPage from 'pages/bookmarks-page'
import { FeaturedPage } from 'pages/featured-page'
import HallOfFamePage from 'pages/hall-of-fame-page'
import TagsPage from 'pages/tags-page'
import { SearchResultsPage } from 'pages/search-results-page'
import { NoMatchPage } from './no-match-page'
import { Spinner } from 'components/core'

const AsyncViewProject = lazy(() => import('pages/project-details-page'))
const AsyncAboutPage = lazy(() => import('pages/about-page'))

const Routes = props => {
  return (
    <Suspense fallback={<Spinner />}>
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
        <Route component={NoMatchPage} />
      </Switch>
    </Suspense>
  )
}

export default Routes
