import React from 'react'

import Routes from './pages/routes'
import { StaticContentContainer } from 'containers/static-content-container'
import { SearchBox, SearchContainer } from 'components/search'
import { Header } from 'components/header/header'
import { Footer } from 'components/footer/footer'
import { ProjectDataContainer } from 'containers/project-data-container'
import { MainContent } from 'components/core'

export const App = () => {
  const { error } = ProjectDataContainer.useContainer()

  return (
    <StaticContentContainer.Provider>
      <SearchContainer.Provider>
        <div id="layout">
          <div id="panel">
            <Header />
            <SearchBox />
            {error ? (
              <ErrorMessage message={error.message || 'Network error'} />
            ) : (
              <>
                <main id="main">
                  <Routes />
                </main>
                <Footer />
              </>
            )}
          </div>
        </div>
      </SearchContainer.Provider>
    </StaticContentContainer.Provider>
  )
}

const ErrorMessage = ({ message }: { message: string }) => {
  const { repo } = StaticContentContainer.useContainer()

  return (
    <MainContent>
      <div
        style={{
          border: '2px solid #fa9e59',
          padding: '4rem 1rem',
          textAlign: 'center',
          fontSize: 16
        }}
      >
        <p style={{ fontSize: '1.4rem' }}>
          Sorry, an error happened while fetching <i>Best of JS</i> data.
        </p>
        <pre>{message}</pre>
        <p>
          Try to <a href="/">reload</a> the window and please reach us on{' '}
          <a href={repo}>GitHub</a> if the problem persists.
        </p>
      </div>
    </MainContent>
  )
}
