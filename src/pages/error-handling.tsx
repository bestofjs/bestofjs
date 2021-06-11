import React from 'react'

import { Button, MainContent } from 'components/core'
import { defaultHelmetProps } from 'constants/constants'
import { Helmet } from 'react-helmet'

// From https://reactjs.org/docs/concurrent-mode-suspense.html#handling-errors
type Props = { fallback: React.ReactNode }
type State = { error: Error | null }
export class ErrorBoundary extends React.Component<Props, State> {
  state = { error: null }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (!!this.state.error) {
      return this.props.fallback
    }
    return this.props.children
  }
}

export const ErrorFallback = () => {
  return (
    <MainContent>
      <Helmet {...defaultHelmetProps}>
        <title>Error</title>
      </Helmet>
      <div
        style={{
          border: '2px solid #fa9e59',
          padding: '4rem 1rem',
          textAlign: 'center',
          fontSize: 16
        }}
      >
        <p>
          The site has been updated, reload the browser or{' '}
          <a href="/">click here</a> to go the home page.
        </p>
        <p>
          If you see this message again, please reach us on GitHub, thank you!
        </p>
        <Button
          onClick={() => window.location.reload()}
          style={{
            fontSize: '1.2rem',
            marginTop: '1rem',
            width: 300,
            display: 'inline'
          }}
        >
          Reload
        </Button>
      </div>
    </MainContent>
  )
}
