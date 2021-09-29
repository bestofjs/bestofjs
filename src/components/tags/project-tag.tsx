import React from 'react'
import { Link } from 'react-router-dom'
import { MdAdd } from 'react-icons/md'

import { Button, Wrap, WrapItem, useColorMode } from 'components/core'
import { useSearch, updateLocation } from '../search'

export const ProjectTagGroup = ({ tags, ...otherProps }) => {
  return (
    <Wrap>
      {tags.map((tag) => (
        <WrapItem key={tag.id}>
          <ProjectTag tag={tag} {...otherProps} />
        </WrapItem>
      ))}
    </Wrap>
  )
}

export const ProjectTag = ({ tag, baseTagIds = [] }) => {
  const { location } = useSearch()
  const { colorMode } = useColorMode()

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
    <Button
      as={Link}
      to={nextLocation}
      variant={colorMode === 'dark' ? 'solid' : 'outline'}
      size="sm"
      fontSize="0.875rem"
      rightIcon={isMultiTagLink ? <MdAdd /> : undefined}
    >
      {tag.name}
    </Button>
  )
}
