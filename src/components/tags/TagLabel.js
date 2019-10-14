import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useSearch, updateLocation } from '../search'

const StyledLink = styled(Link)`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 12px;
  background-color: white;
  color: inherit;
  border: solid 1px #cccccc;
  font-size: 13px;
`

const TagLabel = ({ tag, baseTagIds = [] }) => {
  const { location } = useSearch()

  const isMultiTagLink = baseTagIds.length > 0

  const nextLocation = updateLocation(
    { ...location, pathname: '/projects' },
    {
      query: '',
      selectedTags: [...baseTagIds, tag.id],
      page: 1
    }
  )

  return (
    <StyledLink to={nextLocation} key={tag.id}>
      {isMultiTagLink && <span>+ </span>}
      {tag.name}
    </StyledLink>
  )
}
export default TagLabel
