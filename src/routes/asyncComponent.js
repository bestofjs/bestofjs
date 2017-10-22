/*
Function used to load components in an async. way
E.g.:
const AsyncAboutPage = asyncComponent(() => import('../containers/AboutPage'))
Used perform "code splitting", in order to decrease the size of the main JavaScript bundle
https://serverless-stack.com/chapters/code-splitting-in-create-react-app.html
*/
import React, { Component } from 'react'

const Loading = () => (
  <div id="loading">
    <div className="ui loading button" />
  </div>
)

export default function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props)
      this.state = {
        component: () => <Loading />
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
