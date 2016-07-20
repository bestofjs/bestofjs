import React from 'react'

const Avatar = ({ project, size = 100 }) => (
  <img
    src={`https://avatars.githubusercontent.com/u/${project.owner_id}?v=3&s=${size}`}
    width={size} height={size}
    alt={project.name}
  />
)

export default Avatar
