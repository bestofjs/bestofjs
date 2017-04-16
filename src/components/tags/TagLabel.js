import React from 'react'
import { Link } from 'react-router-dom'

const TagLabel = React.createClass({
  render () {
    const tag = this.props.tag
    return (
      <Link to={`/tags/${tag.id}`}
        key={tag.id}
        className="tag tag-compact"
      >
        <span>{tag.name}</span>
        <span className="tag-counter">{tag.counter}</span>
      </Link>
    )
  }

})

export default TagLabel
