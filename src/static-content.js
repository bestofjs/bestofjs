import React, { useContext } from 'react'

const StaticContentContext = React.createContext()

export const StaticContentProvider = ({ children }) => {
  const content = {
    projectName: 'Best of JavaScript',
    repo: 'https://github.com/bestofjs/bestofjs-webui',
    version: process.env.REACT_APP_VERSION || '0.0.0'
  }
  return (
    <StaticContentContext.Provider value={content}>
      {children}
    </StaticContentContext.Provider>
  )
}

export const useStaticContent = () => useContext(StaticContentContext)
