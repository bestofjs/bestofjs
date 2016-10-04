import React from 'react'

const ToggleMenuButton = React.createClass({
  // No `handleClick` event here, no action `ToggleMenu` action is dispatched
  render () {
    return (
      <a className="menu-link">
        <span className="mega-octicon octicon-three-bars" />
      </a>
    )
  }
})
export default ToggleMenuButton
