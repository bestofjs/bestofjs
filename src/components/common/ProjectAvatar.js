import React from 'react'

import getAvatarUrl from './getAvatarUrl'

const Avatar = ({ project, size = 100 }) => {
  const { svg } = project
  if (svg)
    return (
      <div style={{ width: size }} dangerouslySetInnerHTML={{ __html: svg }} />
    )
  const url = getAvatarUrl(project, size)
  return <img src={url} width={size} height={size} alt={project.name} />
}

export default Avatar
