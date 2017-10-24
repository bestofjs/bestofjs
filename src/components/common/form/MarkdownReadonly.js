import React from 'react'
import marked from 'marked'

const mdReadonly = ({ comment, emptyText }) => {
  if (!comment || comment.trim() === '') {
    return <span className="empty-value">{emptyText || '(No comment)'}</span>
  }
  return (
    <div
      dangerouslySetInnerHTML={{ __html: marked(comment) }}
      className="markdown-body"
    />
  )
}

export default mdReadonly
