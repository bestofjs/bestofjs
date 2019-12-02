import React, { useContext } from 'react'

const StaticContentContext = React.createContext()

export const StaticContentProvider = ({ children }) => {
  const content = {
    projectName: 'Best of JavaScript',
    repo: 'https://github.com/bestofjs/bestofjs-webui',
    version: '0.20.0'
  }
  return (
    <StaticContentContext.Provider value={content}>
      {children}
    </StaticContentContext.Provider>
  )
}

export const useStaticContent = () => useContext(StaticContentContext)
