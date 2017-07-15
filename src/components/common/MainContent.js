import React from 'react'

const MainContent = props =>
  <div id="main-content" className="container" {...props}>
    {props.children}
  </div>

export default MainContent
