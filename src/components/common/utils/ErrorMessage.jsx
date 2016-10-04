import React, { Component } from 'react'
class ErrorMessage extends Component {
  render () {
    return (
      <div className="ui error message">
        {this.props.children}
      </div>
    )
  }
}

export default ErrorMessage
