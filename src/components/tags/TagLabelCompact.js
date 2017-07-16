import React from 'react'
import { Link } from 'react-router-dom'

const TagLabel = props => {
  const tag = props.tag
  return (
    <Link to={'/tags/' + tag.id} key={tag.id} className="tag tag-compact">
      <span>
        {tag.name}
      </span>
    </Link>
  )
}
export default TagLabel
