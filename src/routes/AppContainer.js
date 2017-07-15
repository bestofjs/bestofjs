import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import AppLayout from './AppLayout'
import log from '../helpers/log'

class App extends Component {
  componentDidMount() {
    const history = this.props.history
    // Start Auth0 authenication process, using the browser `history` provided by `withRouter`
    this.props.startAuth(history)
    log('App did mount!')
  }
  componentDidUpdate(prevProps) {
    const { location, onRouterUpdate } = this.props
    // Browser side effects: scroll up and hide the sidebar when the location changes
    if (location !== prevProps.location) {
      onRouterUpdate && onRouterUpdate(location)
    }
  }
  render() {
    log('Render the <App> container', this.props)
    return <AppLayout {...this.props} />
  }
}

export default withRouter(App)
