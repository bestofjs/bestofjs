import React from 'react'
import { NavLink } from 'react-router-dom'

const TagMenuItem = ({ tag, active }) => {
  const url = `/tags/${tag.id}`
  return (
    <NavLink
      to={url}
      className={'tag-menu-item' + (active ? ' active' : '')}
      activeClassName="active"
    >
      {tag.name}
      <span className="counter">
        {tag.counter}
      </span>
    </NavLink>
  )
}

export default TagMenuItem
