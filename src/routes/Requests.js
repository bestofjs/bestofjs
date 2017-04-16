import React from 'react'
import { Route } from 'react-router-dom'
import SubmitRepoPage from '../containers/SubmitRepoPage'
import SubmitHeroPage from '../containers/SubmitHeroPage'
import UserRequestsPage from '../containers/UserRequestsPage'

const RequestsRoutes = () => (
  <div>
    <Route exact path="/requests" component={UserRequestsPage} />
    <Route exact path="/requests/add-project" component={SubmitRepoPage} />
    <Route exact path="/requests/add-hero" component={SubmitHeroPage} />
  </div>
)

export default RequestsRoutes
