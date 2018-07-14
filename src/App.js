import React from 'react'
import { Provider } from 'react-redux'

import AppLayout from './routes/AppLayout'

const App = ({ store, ...props }) => {
  return (
    <Provider store={store}>
      <AppLayout {...props} />
    </Provider>
  )
}

export default App
