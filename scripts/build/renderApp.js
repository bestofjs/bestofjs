import { renderToString } from 'react-dom/server'
import React from 'react'
import { match, RouterContext } from 'react-router'

import { Provider } from 'react-redux'


import getRoutes from '../../src/routes'

// How many "hot" and "popular" projects to display in the home page rendered on the server ?
// This number has to be very low since we only need to render "above the fold" content.
const TOP_PROJECT_COUNT = 5


export default function (store, location) {
  return new Promise((resolve, reject) => {
    let html = ''
    match({ routes: getRoutes(TOP_PROJECT_COUNT), location }, (error, redirectLocation, renderProps) => {
      if (error) return reject(error)
      html = renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      )

      // Send the rendered page back to the client
      // const fullpage = renderFullPage(html, initialState)
      return resolve(html)
    })
  })
}
