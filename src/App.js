import React from 'react'
import { Provider } from 'react-redux'

import Routes from './routes/Routes'
import Sidebar from './components/sidebar/ConnectedSidebar'
import Header from './components/header/ConnectedHeader'
import Footer from './components/footer/ConnectedFooter'
import { SearchBox, SearchProvider } from './components/search'

const App = ({ store, ...props }) => {
  return (
    <Provider store={store}>
      <SearchProvider {...props}>
        <div id="layout">
          <Sidebar {...props} />
          <div id="panel" className="slideout-panel">
            <Header {...props} />
            <SearchBox />
            <main id="main">
              <Routes {...props} />
            </main>
            <Footer />
          </div>
        </div>
      </SearchProvider>
    </Provider>
  )
}

export default App
