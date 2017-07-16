import React from 'react'
import { Route, Switch } from 'react-router-dom'

import getHomePage from '../containers/HomePage'
import AboutPage from '../containers/AboutPage'
import ProjectsPage from '../containers/AllProjectsPage'
import HoFPage from '../containers/HoFPage'
import TagFilter from '../containers/TagFilterPage'
import TextFilter from '../containers/TextFilterPage'
import MyProjectsPage from '../containers/MyProjectsPage'
import items from './sortItems'

import Requests from './Requests'
import Projects from './Projects'
import NoMatch from './NoMatch'

const HomePage = getHomePage(10)

const Routes = () =>
  <Switch>
    <Route exact path="/" component={HomePage} />
    {items.map(item =>
      <Route
        exact
        key={item.key}
        path={`/projects/${item.path}`}
        component={ProjectsPage(item.key)}
      />
    )}
    <Route exact path="/search/:text" component={TextFilter} />
    {items.map(item =>
      <Route
        exact
        key={item.key}
        path={`/tags/:id/${item.path}`}
        component={TagFilter(item.key)}
      />
    )}
    <Route exact path="/hof" component={HoFPage} />
    <Route exact path="/about" component={AboutPage} />
    <Route path="/projects">
      <Projects />
    </Route>
    <Route path="/myprojects">
      <MyProjectsPage />
    </Route>
    <Route path="/requests">
      <Requests />
    </Route>
    <Route component={NoMatch} />
  </Switch>

export default Routes
