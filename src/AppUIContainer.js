import React from 'react'
import { withRouter } from 'react-router-dom'
import onRouterUpdate from './onRouterUpdate'

class AppUIContainer extends React.Component {
  componentDidMount() {
    const history = this.props.history
    // Start Auth0 authentication process, using the browser `history` provided by `withRouter`
    const { authApi } = this.props.dependencies
    authApi.start(history)
    // this.props.startAuth(history)
  }
  componentDidUpdate(prevProps) {
    const { location, store } = this.props
    // Browser side effects: scroll up and hide the sidebar when the location changes
    if (location !== prevProps.location) {
      onRouterUpdate({ location, dispatch: store.dispatch })
    }
  }
  render() {
    return this.props.children
  }
}

export default withRouter(AppUIContainer)
