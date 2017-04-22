import React from 'react'

const Avatar = ({ project, size = 100 }) => {
  const { svg, icon } = project
  if (svg) return (
    <div
      style={{ width: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
  const githubAvatarUrl = `https://avatars.githubusercontent.com/u/${project.owner_id}?v=3&s=${size}`
  const url = icon || githubAvatarUrl
  return (
    <img
      src={url}
      width={size} height={size}
      alt={project.name}
    />
  )
}

export default Avatar
