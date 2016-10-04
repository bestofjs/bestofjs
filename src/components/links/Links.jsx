import React from 'react'

import MainContent from '../common/MainContent'
import LinkCard from './LinkCard'

export default ({ links, username }) => (
  <MainContent>
    <h1 style={{ marginBottom: '1rem' }}>
      Useful links <span style={{ color: '#bbb' }}>({links.length})</span>
    </h1>
    <div>
      {links.map(link => (
        <LinkCard
          key={link._id}
          link={link}
          project={link.projects[0]}
          showProjects
          editable={username === link.createdBy}
        />
      ))}
    </div>
  </MainContent>
)
