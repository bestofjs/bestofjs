import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const Item = styled(NavLink)`
  display: block;
  padding: 0.3em 0;
  color: rgba(255, 255, 255, 0.7);
  :hover {
    color: #fff;
    text-decoration: none;
  }
`

const Counter = styled.span`
  float: right;
  color: rgba(255, 255, 255, 0.5);
`

const TagMenuItem = ({ tag }) => {
  const url = `/tags/${tag.id}`
  return (
    <Item to={url} className={'tag-menu-item'}>
      {tag.name}
      <Counter>{tag.counter}</Counter>
    </Item>
  )
}

export default TagMenuItem
