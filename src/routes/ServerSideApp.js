/*
Application layout used only to do server-side rendering.
We had to create this specific when code splitting and dynamic modules were introduced.
There must be a smarter way to do SSR using the normal <AppLayout> component
*/
import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Sidebar from '../components/sidebar/ConnectedSidebar'
import Header from '../components/header/ConnectedHeader'
import Footer from '../components/footer/ConnectedFooter'

import getHomePage from '../containers/HomePage'
import TagFilter from '../containers/TagFilterPage'
import AllProjectsPage from '../containers/AllProjectsPage'
import HoFPage from '../containers/HoFPage'

const HomePage = getHomePage(10)

const ServerSideLayout = () => {
  return (
    <div id="layout">
      <Sidebar />
      <div id="panel" className="slideout-panel">
        <Header />
        <main id="main">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route
              exact
              path={'/projects'}
              component={AllProjectsPage('total')}
            />
            <Route exact path={'/tags/:id'} component={TagFilter('total')} />
            <Route exact path="/hall-of-fame" component={HoFPage} />
          </Switch>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default ServerSideLayout
