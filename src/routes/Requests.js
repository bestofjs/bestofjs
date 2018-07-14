import React from 'react'
import { Route } from 'react-router-dom'

import UserRequestsPage from '../pages/UserRequestsPage'

const RequestsRoutes = () => (
  <div>
    <Route exact path="/requests" component={UserRequestsPage} />
  </div>
)

export default RequestsRoutes
