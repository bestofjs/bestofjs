import { renderToString } from 'react-dom/server'
import React from 'react'
import { StaticRouter } from 'react-router'

import { Provider } from 'react-redux'

import App from '../../src/routes/ServerSideApp'

export default function(store, location) {
  return new Promise(resolve => {
    const html = renderToString(
      <Provider store={store}>
        <StaticRouter location={location}>
          <App />
        </StaticRouter>
      </Provider>
    )
    return resolve(html)
  })
}
