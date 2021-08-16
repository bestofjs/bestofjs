import React from 'react'
import { Link } from 'react-router-dom'
import { Tag as ChakraTag, Wrap, WrapItem } from '@chakra-ui/react'

import { useSearch, updateLocation } from '../search'

export const TagLabelGroup = ({ tags, ...otherProps }) => {
  return (
    <Wrap>
      {tags.map(tag => (
        <WrapItem key={tag.id}>
          <TagLabel tag={tag} {...otherProps} />
        </WrapItem>
      ))}
    </Wrap>
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
