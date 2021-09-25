import React from 'react'
import { Link } from 'react-router-dom'
import { MdAdd } from 'react-icons/md'

import {
  Tag,
  TagLabel,
  TagLeftIcon,
  Wrap,
  WrapItem,
  useColorMode
} from 'components/core'
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
    <Link to={nextLocation}>
      <Tag
        fontFamily="heading"
        size="lg"
        variant={colorMode === 'dark' ? 'subtle' : 'outline'}
      >
        {isMultiTagLink && <TagLeftIcon as={MdAdd} fontSize="16px" />}
        <TagLabel>{tag.name}</TagLabel>
      </Tag>
    </Link>
  )
}
