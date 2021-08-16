import React from 'react'
import { Link } from 'react-router-dom'
import { Tag, TagLabel, TagLeftIcon, Wrap, WrapItem } from '@chakra-ui/react'
import { MdAdd } from 'react-icons/md'

import { useSearch, updateLocation } from '../search'

export const ProjectTagGroup = ({ tags, ...otherProps }) => {
  return (
    <Wrap>
      {tags.map(tag => (
        <WrapItem key={tag.id}>
          <ProjectTag tag={tag} {...otherProps} />
        </WrapItem>
      ))}
    </Wrap>
  )
}

export const ProjectTag = ({ tag, baseTagIds = [] }) => {
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
    <Tag fontFamily="heading">
      <Link to={nextLocation}>
        {isMultiTagLink && <TagLeftIcon as={MdAdd} />}
        <TagLabel fontSize="14px">{tag.name}</TagLabel>
      </Link>
    </Tag>
  )
}
