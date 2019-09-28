import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { stateToQueryString, SearchContext } from '../search'

const StyledLink = styled(Link)`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 12px;
  background-color: white;
  color: inherit;
  border: solid 1px #cccccc;
  font-size: 13px;
`

const TagLabel = ({ tag }) => {
  const { sortOption } = useContext(SearchContext)
  const queryString = stateToQueryString({
    sort: sortOption.id,
    selectedTags: [tag.id]
  })

  return (
    <StyledLink
      to={{ pathname: '/projects', search: '&' + queryString }}
      key={tag.id}
    >
      <span>{tag.name}</span>
    </StyledLink>
  )
}
export default TagLabel
