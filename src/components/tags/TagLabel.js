import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const StyledLink = styled(Link)`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 12px;
  background-color: white;
  color: #cc4700;
  border: solid 1px #cc4700;
  font-size: 13px;
`

const TagLabel = props => {
  const tag = props.tag
  return (
    <StyledLink to={'/tags/' + tag.id} key={tag.id}>
      <span>{tag.name}</span>
    </StyledLink>
  )
}
export default TagLabel
