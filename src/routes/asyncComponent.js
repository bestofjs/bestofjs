/*
Function used to load components in an async. way
E.g.:
const AsyncAboutPage = asyncComponent(() => import('../containers/AboutPage'))
Used perform "code splitting", in order to decrease the size of the main JavaScript bundle
https://serverless-stack.com/chapters/code-splitting-in-create-react-app.html
*/
import React, { Component } from 'react'
import Spinner from '../components/common/Spinner'

export default function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props)
      console.log('Async', props)

      this.state = {
        component: () => <Spinner />
      }
    }
    async componentDidMount() {
      const { default: component } = await importComponent()
      this.setState({
        component
      })
    }
    render() {
      const C = this.state.component
      return C ? <C {...this.props} /> : null
    }
  }

  return AsyncComponent
}
