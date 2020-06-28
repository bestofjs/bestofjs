import React from 'react'

import Routes from './pages/routes'
import { StaticContentContainer } from 'containers/static-content-container'
import { SearchBox, SearchContainer } from 'components/search'
import { Header } from 'components/header/header'
import { Footer } from 'components/footer/footer'

export const App = props => {
  return (
    <StaticContentContainer.Provider>
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
    </StaticContentContainer.Provider>
  )
}
