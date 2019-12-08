/*
Function used to perform "code splitting", in order to decrease the size of the main JavaScript bundle
E.g.:
const AsyncAboutPage = asyncComponent(() => import('../containers/AboutPage'))
https://serverless-stack.com/chapters/code-splitting-in-create-react-app.html
*/
import React, { Component } from 'react'
import Spinner from '../components/common/Spinner'
import MainContent from '../components/common/MainContent'

export default function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props)
      this.state = {
        Component: undefined,
        loading: true,
        error: true
      }
    }
    async componentDidMount() {
      try {
        const { default: Component } = await importComponent()
        this.setState({
          loading: false,
          Component
        })
      } catch (error) {
        this.setState({ loading: false, error })
      }
    }
    render() {
      const { Component, loading, error } = this.state

      if (loading) {
        return <Spinner />
      }

      if (error) {
        return (
          <MainContent>
            <p>
              The site has been updated, please reload the page or{' '}
              <a href="/">click here</a> to reload the home page.
            </p>
            <p>
              If you see again this message, reach us on GitHub, thank you for
              your cooperation!
            </p>
          </MainContent>
        )
      }

      return <Component {...this.props} />
    }
  }

  return AsyncComponent
}
