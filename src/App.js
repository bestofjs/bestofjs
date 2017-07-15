import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'

import Routes from './routes/AppContainer'
import onRouterUpdate from './onRouterUpdate'

const App = ({ store }) =>
  <Provider store={store}>
    <Router>
      <Routes onRouterUpdate={onRouterUpdate} />
    </Router>
  </Provider>

export default App
