import React from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'

import { Button, Cell, Grid } from 'components/core'
import { useSearch, updateLocation } from '../search'

export const TagLabelGroup = ({ tags, ...otherProps }) => {
  return (
    <Grid>
      {tags.map(tag => (
        <Cell key={tag.id}>
          <TagLabel tag={tag} {...otherProps} />
        </Cell>
      ))}
    </Grid>
  )
}

const Tag = styled(Button)`
  display: inline-block;
  font-size: 13px;
  border-radius: 12px;
  padding: 4px 8px;
`
const TagLink = Tag.withComponent(Link)

export const TagLabel = ({
  tag,
  baseTagIds = []
}: {
  tag: BestOfJS.Tag
  baseTagIds?: string[]
}) => {
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
    <TagLink key={tag.id} to={nextLocation} as={Link}>
      {isMultiTagLink && <span>+ </span>}
      {tag.name}
    </TagLink>
  )
}
