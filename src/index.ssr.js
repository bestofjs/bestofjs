import React from 'react'
import { StaticRouter } from 'react-router'
import { Provider } from 'react-redux'

import App from './routes/ServerSideApp'

const ServerEntryPoint = ({ store, location }) => (
  <Provider store={store}>
    <StaticRouter location={location}>
      <App />
    </StaticRouter>
  </Provider>
)

export default ServerEntryPoint
