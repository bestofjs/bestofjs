import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const LinkList = styled.ul`
  margin-top: 0;
  padding-left: 1.2em;
  li {
    margin-bottom: 0.5rem;
  }
  li:last-child {
    margin-bottom: 0;
  }
`

const TagList = ({ tags }) => {
  return (
    <LinkList>
      {tags.map(tag => (
        <li key={tag.id}>
          <Link to={`/tags/${tag.id}`}>{tag.name}</Link> ({tag.counter}{' '}
          projects)
        </li>
      ))}
    </LinkList>
  )
}

TagList.propTypes = {
  tags: PropTypes.array
}

export default TagList
