import React from 'react'
import { Link } from 'react-router-dom'
import { Tag as ChakraTag } from '@chakra-ui/react'

import { Cell, Grid } from 'components/core'
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

export const TagLabel = ({ tag, baseTagIds = [] }) => {
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
    <ChakraTag fontFamily="heading">
      <Link to={nextLocation}>
        {isMultiTagLink && <span>+ </span>}
        {tag.name}
      </Link>
    </ChakraTag>
  )
}
