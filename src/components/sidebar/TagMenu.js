import React from 'react'

import TagMenuItem from './TagMenuItem'

const TagMenu = ({ tags, selectedTag, ui }) => {
  return (
    <div className="tag-menu">
      {tags.map(tag =>
        <TagMenuItem
          tag={tag}
          key={tag.id}
          active={tag.id === selectedTag}
          ui={ui}
        />
       )}
    </div>
  )
}
export default TagMenu
