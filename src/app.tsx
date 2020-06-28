import React from 'react'

import Routes from 'routes/Routes'
import { Header } from 'components/header/header'
import { Footer } from 'components/footer/footer'
import { SearchBox, SearchContainer } from 'components/search'
import { StaticContentProvider } from 'static-content'

export const App = ({ store, ...props }) => {
  return (
    <StaticContentProvider>
      <SearchContainer.Provider {...props}>
        <div id="layout">
          <div id="panel">
            <Header {...props} />
            <SearchBox />
            <main id="main">
              <Routes {...props} />
            </main>
            <Footer />
          </div>
        </div>
      </SearchContainer.Provider>
    </StaticContentProvider>
  )
}
