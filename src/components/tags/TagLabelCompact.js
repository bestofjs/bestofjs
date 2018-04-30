import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const StyledLink = styled(Link)`
  display: inline-block;
  margin-right: 5px;
  margin-bottom: 5px;
  padding: 5px 10px;
  border-radius: 4px;
  background-color: #ececec;
  color: #333;
  border: solid 1px #ccc;
  font-size: 13px;
  marginleft: 10;
  .tag-counter {
    margin-left: 5px;
    color: #999;
  }
`

const TagLabel = props => {
  const tag = props.tag
  return (
    <StyledLink to={'/tags/' + tag.id} key={tag.id} className="tag tag-compact">
      <span>{tag.name}</span>
    </StyledLink>
  )
}
export default TagLabel
