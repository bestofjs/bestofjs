import React from 'react'
import marked from 'marked'

export default ({ comment, emptyText }) => {
  if (!comment || comment.trim() === '') {
    return (
      <span className="empty-value">
        {emptyText ? emptyText : '(No comment)'}
      </span>
    )
  }
  return (
    <div dangerouslySetInnerHTML={{ __html: marked(comment) }} />
  )
}
