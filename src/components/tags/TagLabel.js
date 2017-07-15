import React from 'react'
import { Link } from 'react-router-dom'

const TagLabel = ({ tag }) => {
  return (
    <Link to={`/tags/${tag.id}`} key={tag.id} className="tag tag-compact">
      <span>
        {tag.name}
      </span>
      <span className="tag-counter">
        {tag.counter}
      </span>
    </Link>
  )
}

export default TagLabel
